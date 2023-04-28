import { BigNumber } from "ethers";

export function calculateDrawTimestamps(endTimestampOffset: BigNumber, draw: any): [BigNumber, BigNumber] {
  const startTimestampOffset: BigNumber = draw.beaconPeriodSeconds;
  const startTime: BigNumber = draw.timestamp.sub(startTimestampOffset);
  const endTime: BigNumber = draw.timestamp.sub(endTimestampOffset);

  return [startTime, endTime];
}
