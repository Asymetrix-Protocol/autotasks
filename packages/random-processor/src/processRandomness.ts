import { PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { BigNumber, Contract } from "ethers";

import { getContract } from "./utils";

export async function processRandomness(
  contracts: ContractsBlob,
  config: ProviderOptions,
  drawId: BigNumber,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider }: ProviderOptions = config;
  const prizeDistributor: Contract | undefined = getContract("PrizeDistributor", chainId, provider, contracts);

  if (!prizeDistributor) {
    throw new Error("PrizeDistributor: contract unavailable.");
  }

  return await prizeDistributor.populateTransaction.processRandomness(drawId);
}
