import { DefenderRelayProvider, DefenderRelaySigner } from "defender-relay-client/lib/ethers";

import { JsonRpcProvider } from "@ethersproject/providers";

// Config types
export interface ContractData {
  address: string;
  chainId?: number;
  type: string;
  abi: any;
}

export interface ContractsBlob {
  contracts: ContractData[];
}

export interface ProviderOptions {
  chainId: number;
  provider: DefenderRelayProvider | DefenderRelaySigner | JsonRpcProvider;
}
