import { PopulatedTransaction } from "@ethersproject/contracts";

import { ContractsBlob, ProviderOptions } from "./types";

import { BigNumber, Contract } from "ethers";

import { getContract } from "./utils";

const debug = require("debug")("pt-autotask-lib");

export async function drawBeaconHandleDrawStartAndComplete(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;
  const drawBeacon: Contract | undefined = getContract("DrawBeacon", chainId, provider, contracts);

  if (!drawBeacon) {
    throw new Error("DrawBeacon: contract unavailable");
  }

  const nextDrawId: BigNumber = await drawBeacon.getNextDrawId();
  console.log("nextDrawId:", nextDrawId.toString());

  const beaconPeriodStartedAt: BigNumber = await drawBeacon.getBeaconPeriodStartedAt();
  console.log("beaconPeriodStartedAt:", beaconPeriodStartedAt.toString());

  const beaconPeriodSeconds: BigNumber = await drawBeacon.getBeaconPeriodSeconds();
  console.log("beaconPeriodSeconds:", beaconPeriodSeconds.toString());

  const beaconPeriodRemainingSeconds: BigNumber = await drawBeacon.beaconPeriodRemainingSeconds();
  console.log("beaconPeriodRemainingSeconds:", beaconPeriodRemainingSeconds.toString());

  const canStartDraw: Boolean = await drawBeacon.canStartDraw();
  console.log("canStartDraw:", canStartDraw);

  // Debug Contract Request Parameters
  debug("DrawBeacon: nextDrawId: ", nextDrawId.toString());
  debug("DrawBeacon: beaconPeriodStartedAt: ", beaconPeriodStartedAt.toString());
  debug("DrawBeacon: beaconPeriodSeconds: ", beaconPeriodSeconds.toString());
  debug("DrawBeacon: beaconPeriodRemainingSeconds: ", beaconPeriodRemainingSeconds.toString());
  debug("Can start draw: ", canStartDraw);

  let transactionPopulated: PopulatedTransaction | undefined;

  if (canStartDraw) {
    console.log("DrawBeacon: starting a new draw");

    transactionPopulated = await drawBeacon.populateTransaction.startDraw();
  }

  return transactionPopulated;
}
