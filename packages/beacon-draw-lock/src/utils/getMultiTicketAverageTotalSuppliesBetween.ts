import { Contract } from "@ethersproject/contracts";

import { BigNumber, BigNumberish } from "ethers";

export async function getMultiTicketAverageTotalSuppliesBetween(
  tickets: Array<Contract | undefined> | undefined,
  startTime?: BigNumberish,
  endTime?: BigNumberish,
): Promise<BigNumber[] | undefined> {
  if (!tickets || !startTime || !endTime) return undefined;

  return await Promise.all(
    tickets.map(async (contract: Contract) => {
      if (!contract) return undefined;

      try {
        const averageTotalSuppliesBetween: BigNumber[] = await contract.getAverageTotalSuppliesBetween(
          [startTime],
          [endTime],
        );

        return averageTotalSuppliesBetween[0];
      } catch (error) {
        console.log("Error:", error);

        return undefined;
      }
    }),
  );
}

export default getMultiTicketAverageTotalSuppliesBetween;
