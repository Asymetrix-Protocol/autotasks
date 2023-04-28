import mainnetContracts from "./contracts/mainnet/contracts.json";
import goerliContracts from "./contracts/goerli/contracts.json";

import { ContractsBlob } from "./index";

export function getContracts(chainId: number): ContractsBlob {
  if (chainId === 1) {
    return mainnetContracts;
  }

  if (chainId === 5) {
    return goerliContracts;
  }
}
