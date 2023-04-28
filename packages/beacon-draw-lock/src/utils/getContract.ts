import { ContractData, ContractsBlob } from "../types";

import { Contract, ethers } from "ethers";

export function getContract(
  name: string,
  chainId: number,
  providerOrSigner: any,
  contractsBlob: ContractsBlob,
): Contract | undefined {
  if (!name || !chainId) throw new Error(`Invalid contract parameters`);

  const contract: ContractData[] = contractsBlob.contracts.filter(
    (contract: ContractData) => contract.type === name && contract.chainId === chainId,
  );

  if (contract[0]) {
    return new ethers.Contract(contract[0].address, contract[0].abi, providerOrSigner);
  }

  throw new Error(`Contract unavailable: ${name} on chainId: ${chainId}`);
}

export default getContract;
