import { ContractsBlob, Draw, ProviderOptions } from "./types";

import { JsonRpcProvider } from "@ethersproject/providers";

import { BigNumber, Contract } from "ethers";

import { getContract } from "./utils";

// Returns the last UNPAID draw ID from the PrizeDistributor contract.
export async function getLastUnpaidDrawId(contracts: ContractsBlob, config: ProviderOptions): Promise<BigNumber> {
  const { chainId, provider }: ProviderOptions = config;
  const prizeDistributor: Contract | undefined = getContract("PrizeDistributor", chainId, provider, contracts);

  if (!prizeDistributor) {
    throw new Error("PrizeDistributor: contract unavailable.");
  }

  return await prizeDistributor.getLastUnpaidDrawId();
}

// Retrieves a draw from the DrawBuffer by its ID.
export async function getDrawById(contracts: ContractsBlob, config: ProviderOptions, drawID: BigNumber): Promise<Draw> {
  const { chainId, provider }: ProviderOptions = config;
  const drawBuffer: Contract | undefined = getContract("DrawBuffer", chainId, provider, contracts);

  if (!drawBuffer) {
    throw new Error("DrawBuffer: contract unavailable.");
  }

  return await drawBuffer.getDraw(drawID);
}

// Returns `true` if draw is finished, `false` otherwise.
export async function isFinishedDraw(
  contracts: ContractsBlob,
  config: ProviderOptions,
  rpc: string,
  drawID: BigNumber,
): Promise<boolean> {
  const draw: Draw = await getDrawById(contracts, config, drawID);
  const rpcProvider: JsonRpcProvider = new JsonRpcProvider(rpc);
  const lastBlockTimestamp: BigNumber = BigNumber.from(
    (await rpcProvider.getBlock(await rpcProvider.getBlockNumber())).timestamp,
  );

  return lastBlockTimestamp.gt(draw.beaconPeriodStartedAt.add(draw.beaconPeriodSeconds));
}
