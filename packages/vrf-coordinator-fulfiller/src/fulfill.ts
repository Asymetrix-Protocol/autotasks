import { PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { BigNumber } from "@ethersproject/bignumber";

import { getContract } from "./utils";

import { Contract } from "ethers";

export async function fulfill(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;
  const vrfCoordinator: Contract | undefined = getContract("VRFCoordinatorMock", chainId, provider, contracts);

  if (!vrfCoordinator) {
    throw new Error("VRFCoordinatorFulfiller: VRFCoordinatorMock contract unavailable");
  }

  const requestId: BigNumber = await vrfCoordinator.requestsCounter();

  return await vrfCoordinator.populateTransaction.fulfill(requestId);
}
