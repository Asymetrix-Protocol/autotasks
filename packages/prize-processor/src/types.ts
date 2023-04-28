import { DefenderRelayProvider, DefenderRelaySigner } from "defender-relay-client/lib/ethers";

import { JsonRpcProvider } from "@ethersproject/providers";

import { BigNumber } from "@ethersproject/bignumber";

// Config types
export interface ProviderOptions {
  chainId: number;
  provider: DefenderRelayProvider | DefenderRelaySigner | JsonRpcProvider;
}

export interface ContractData {
  address: string;
  chainId?: number;
  type: string;
  abi: any;
}

export interface ContractsBlob {
  contracts: ContractData[];
}

// Contracts types
export interface Draw {
  drawId: BigNumber;
  timestamp: BigNumber;
  beaconPeriodStartedAt: BigNumber;
  beaconPeriodSeconds: BigNumber;
  rngRequestInternalId: BigNumber;
  participantsHash: string;
  randomness: BigNumber[];
  picksNumber: BigNumber;
  paid: boolean;
}

// Custom types
export interface ParticipantsInfo {
  participants: string[];
  picksNumber: BigNumber;
  ipfsHash: string;
  isEmptyResult: boolean;
}
