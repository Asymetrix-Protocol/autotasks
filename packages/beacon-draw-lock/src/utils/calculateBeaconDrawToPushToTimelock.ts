import { Contract } from "@ethersproject/contracts";

import { BigNumber } from "ethers";

import { Draw } from "../types";

export async function calculateBeaconDrawToPushToTimelock(
  drawBufferBeaconChain: Contract,
  prizeDistributionBufferBeaconChain: Contract,
): Promise<{ lockAndPush: Boolean; drawIdToFetch: BigNumber }> {
  let newestPrizeDistributionDrawId: BigNumber = BigNumber.from(0);
  let drawIdToFetch: BigNumber = BigNumber.from(0);
  let newestDrawFromBeaconChain: Draw;
  let lockAndPush: Boolean = false;

  /**
   * Fetch newest Draw from Beacon Chain
   * If the fetch throws an error, the DrawBuffer is not initialized
   */
  try {
    newestDrawFromBeaconChain = await drawBufferBeaconChain.getNewestDraw();
  } catch (error) {
    throw new Error("BeaconChain: DrawBuffer is not initialized");
  }

  /**
   * Fetch newest PrizeDistribution from Beacon Chain
   * If the fetch throws an error, the PrizeDistribution is not initialized
   */
  try {
    const { drawId }: { drawId: BigNumber } = await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();

    newestPrizeDistributionDrawId = BigNumber.from(drawId);
  } catch (error) {
    newestPrizeDistributionDrawId = BigNumber.from(0);
  }

  console.log("newestPrizeDistributionDrawId:", newestPrizeDistributionDrawId.toString());
  console.log("newestDrawFromBeaconChain.drawId:", newestDrawFromBeaconChain.drawId.toString());

  /**
   * If the PrizeDistribution is behind the DrawBuffer
   */
  if (newestPrizeDistributionDrawId.lt(newestDrawFromBeaconChain.drawId)) {
    lockAndPush = true;
    drawIdToFetch = newestPrizeDistributionDrawId.add(BigNumber.from(1));

    console.log("DrawBuffer Newest Draw: ", newestDrawFromBeaconChain);
    console.log("PrizeDistributionBuffer newest PrizeDistribution DrawID: ", newestPrizeDistributionDrawId.toString());
  }

  return {
    lockAndPush,
    drawIdToFetch,
  };
}
