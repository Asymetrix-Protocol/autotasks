import goerliContracts from "./contracts/goerli/contracts.json";

import { ContractsBlob } from "./index";

export function getContracts(chainId: number): ContractsBlob {
  if (chainId === 5) {
    return goerliContracts;
  }
}
