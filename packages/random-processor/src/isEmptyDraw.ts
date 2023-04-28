import { BigNumber } from "ethers";

import axios from "axios";

/**
 * Queries the data from the Asymetrix database using Asymetrix draw ID to check
 * if draw is empty (without participants) or not (with participants).
 */
export async function isEmptyDraw(event: any, asymetrixDrawId: BigNumber): Promise<boolean> {
  console.log(`Requesting \`isEmptyResult\` for the draw ${asymetrixDrawId.toString()}.`);

  try {
    const response: any = await axios.get(
      event.secrets.ASYMETRIX_API_URL + `draws/${asymetrixDrawId.toString()}/is-empty-result`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(response.data);

    if (!response || response.status != 200) {
      throw new Error("Undefined response or invalid response code (status).");
    }

    if (response.data.isEmptyResult === undefined) {
      throw new Error("Wrong response format.");
    }

    return response.data.isEmptyResult;
  } catch (error: any) {
    throw new Error(
      `Error while requesting \`isEmptyResult\` for the draw ${asymetrixDrawId.toString()}: ${error.message}.`,
    );
  }
}
