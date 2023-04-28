import { Contract, PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { BigNumber } from "ethers";

import {
  getMultiTicketAverageTotalSuppliesBetween,
  calculateBeaconDrawToPushToTimelock,
  calculateDrawTimestamps,
  sumBigNumbers,
  getContract,
} from "./utils";

const debug = require("debug")("pt-autotask-lib");

export async function beaconDrawLockAndNetworkTotalSupplyPush(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;

  /* ======================================================================================= */
  // Initializing Contracts using the Beacon/Receiver/SecondaryReceiver chain configurations
  /* ======================================================================================= */
  const drawBufferBeaconChain: Contract | undefined = getContract("DrawBuffer", chainId, provider, contracts);

  const prizeDistributionFactory: Contract | undefined = getContract(
    "PrizeDistributionFactory",
    chainId,
    provider,
    contracts,
  );
  const prizeDistributionBufferBeaconChain: Contract | undefined = getContract(
    "PrizeDistributionBuffer",
    chainId,
    provider,
    contracts,
  );
  const beaconTimelockAndPushRouter: Contract | undefined = getContract(
    "BeaconTimelockTrigger",
    chainId,
    provider,
    contracts,
  );

  if (
    !drawBufferBeaconChain ||
    !prizeDistributionFactory ||
    !prizeDistributionBufferBeaconChain ||
    !beaconTimelockAndPushRouter
  ) {
    throw new Error("Contract Unavailable: Check Contracts List and Provider Configuration");
  }

  const otherTicketContracts: Array<Contract | undefined> | undefined = [
    getContract("Ticket", chainId, provider, contracts),
  ];
  const { lockAndPush, drawIdToFetch }: { lockAndPush: Boolean; drawIdToFetch: BigNumber } =
    await calculateBeaconDrawToPushToTimelock(drawBufferBeaconChain, prizeDistributionBufferBeaconChain);

  console.log("lockAndPush:", lockAndPush);
  console.log("drawIdToFetch:", drawIdToFetch.toString());

  /**
   * The calculateBeaconDrawToPushToTimelock calculate whether a Draw needs to be locked and pushed.
   * If a Draw and PrizeDistribution need to be locked/pushed we fetch the required data.
   */
  if (lockAndPush) {
    const drawFromBeaconChainToPush: any = await drawBufferBeaconChain.getDraw(drawIdToFetch);
    console.log("drawFromBeaconChainToPush:", drawFromBeaconChainToPush);

    const endTimestampOffset: BigNumber = await prizeDistributionFactory.endTimestampOffset();
    const [startTime, endTime]: [BigNumber, BigNumber] = calculateDrawTimestamps(
      endTimestampOffset,
      drawFromBeaconChainToPush,
    );

    console.log("endTime:", endTime);
    console.log("startTime:", startTime);

    const allTicketAverageTotalSupply: BigNumber[] | undefined = await getMultiTicketAverageTotalSuppliesBetween(
      otherTicketContracts,
      startTime,
      endTime,
    );

    console.log("allTicketAverageTotalSupply:", allTicketAverageTotalSupply);

    debug("allTicketAverageTotalSupply", allTicketAverageTotalSupply);

    if (!allTicketAverageTotalSupply || allTicketAverageTotalSupply.length === 0) {
      throw new Error("No Ticket data available");
    }

    const totalNetworkTicketSupply: BigNumber = sumBigNumbers(allTicketAverageTotalSupply);

    console.log("totalNetworkTicketSupply:", totalNetworkTicketSupply.toString());

    debug("Draw: ", drawFromBeaconChainToPush);
    debug("TotalNetworkSupply: ", totalNetworkTicketSupply);

    return await beaconTimelockAndPushRouter.populateTransaction.push(
      drawFromBeaconChainToPush,
      totalNetworkTicketSupply,
    );
  } else {
    throw new Error("No Draw to LockAndPush");
  }
}
