import { PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { getContract } from "./utils";

import { Contract } from "ethers";

export async function prizeFlush(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;
  const prizeFlush: Contract | undefined = getContract("PrizeFlush", chainId, provider, contracts);

  if (!prizeFlush) {
    throw new Error("PrizeFlush: contract unavailable");
  }

  return await prizeFlush.populateTransaction.flush();
}
