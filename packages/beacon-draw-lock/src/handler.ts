import { beaconDrawLockAndNetworkTotalSupplyPush, ContractsBlob, getContracts } from "./index";

import { DefenderRelayProvider, DefenderRelaySigner } from "defender-relay-client/lib/ethers";

import { Relayer, RelayerParams, RelayerTransaction } from "defender-relay-client";

import { PopulatedTransaction } from "@ethersproject/contracts";

export async function handler(event: RelayerParams): Promise<void> {
  const provider: DefenderRelayProvider = new DefenderRelayProvider(event);
  const signer: DefenderRelaySigner = new DefenderRelaySigner(event, provider, { speed: "fastest" });
  const relayer: Relayer = new Relayer(event);
  const chainId: number = Number(process.env.CHAIN_ID);
  const contracts: ContractsBlob = getContracts(chainId);

  try {
    console.log(`Adding a new draw to the PrizeDistributionBuffer.`);

    const transactionPopulated: PopulatedTransaction | undefined = await beaconDrawLockAndNetworkTotalSupplyPush(
      contracts,
      {
        chainId,
        provider: signer,
      },
    );

    console.log("Populated transaction: ", transactionPopulated);

    if (transactionPopulated) {
      const estimatedGas: number = (
        await signer.estimateGas({
          data: transactionPopulated.data,
          to: transactionPopulated.to,
        })
      ).toNumber();
      const transactionSentToNetwork: RelayerTransaction = await relayer.sendTransaction({
        data: transactionPopulated.data,
        to: transactionPopulated.to,
        gasLimit: estimatedGas + Math.ceil(estimatedGas * 0.1),
      });

      console.log("Transaction hash: ", transactionSentToNetwork.hash);
    } else {
      throw new Error("BeaconDrawLock: transaction is not populated.");
    }
  } catch (error) {
    console.log(error);
  }
}
