import { PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { getContract, getRandomFloat } from "./utils";

import { BigNumber } from "@ethersproject/bignumber";

import { Contract } from "ethers";

export async function fundPrizePool(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;
  const prizePool: Contract | undefined = getContract("StakePrizePool", chainId, provider, contracts);

  if (!prizePool) {
    throw new Error("PrizePoolFunder: PrizePool contract unavailable");
  }

  // Needed to mock ERC-20 interface (ERC-20 ABI)
  const asxToken: Contract | undefined = getContract("ASX", chainId, provider, contracts);

  if (!asxToken) {
    throw new Error("PrizePoolFunder: ASX contract unavailable");
  }

  const fundingTokenAddress: string = "0xBa8DCeD3512925e52FE67b1b5329187589072A55"; // DAI (Goerli testnet)
  const fundingToken: Contract = new Contract(fundingTokenAddress, asxToken.interface, provider);
  const randomAmount: number = getRandomFloat(0.1, 10.0, 18);

  console.log(`Transferring ${randomAmount} tokens to the PrizePool contract.`);

  const amount: BigNumber = BigNumber.from((randomAmount * 1e18).toString());

  return await fundingToken.populateTransaction.transfer(prizePool.address, amount);
}
