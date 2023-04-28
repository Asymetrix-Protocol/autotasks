import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";

import { ContractData, ContractsBlob } from "../types";

import { Contract, ethers } from "ethers";

export function getContract(
  name: string,
  chainId: number,
  providerOrSigner: Provider | Signer,
  contractsBlob: ContractsBlob,
): Contract | undefined {
  if (!name || !chainId) throw new Error(`Invalid contract parameters.`);

  const contracts: ContractData[] = contractsBlob.contracts.filter(
    (contract: ContractData) => contract.type === name && contract.chainId === chainId,
  );

  if (contracts[0]) {
    return new ethers.Contract(contracts[0].address, contracts[0].abi, providerOrSigner);
  }

  throw new Error(`Contract unavailable: ${name} on chain ID: ${chainId} `);
}
