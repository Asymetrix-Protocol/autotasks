import { PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { BigNumber, Contract } from "ethers";

import { getContract } from "./utils";

export async function requestRandomness(
  contracts: ContractsBlob,
  config: ProviderOptions,
  drawId: BigNumber,
  picksNumber: BigNumber,
  participantsHash: Buffer,
  isEmptyDraw: boolean,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider }: ProviderOptions = config;
  const prizeDistributor: Contract | undefined = getContract("PrizeDistributor", chainId, provider, contracts);

  if (!prizeDistributor) {
    throw new Error("PrizeDistributor: contract unavailable.");
  }

  return await prizeDistributor.populateTransaction.requestRandomness(
    drawId,
    picksNumber,
    participantsHash,
    isEmptyDraw,
  );
}
