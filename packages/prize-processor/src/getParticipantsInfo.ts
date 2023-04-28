import { ParticipantsInfo } from "./types";

import { BigNumber } from "ethers";

import axios from "axios";

/**
 * Queries participants info from the Asymetrix database using Asymetrix draw ID.
 */
export async function getParticipantsInfo(
  event: any,
  asymetrixDrawId: BigNumber,
): Promise<ParticipantsInfo | undefined> {
  console.log("Reading participants info from the Asymetrix database using Asymetrix draw ID ...");

  try {
    const response: any = await axios.get(
      event.secrets.ASYMETRIX_API_URL + `draws/${asymetrixDrawId.toString()}/participants`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response || response.status != 200) {
      throw new Error("Undefined response or invalid response code (status).");
    }

    if (
      !response.data.participants ||
      response.data.totalPicks === undefined ||
      !response.data.participantsHash ||
      response.data.isEmptyResult === undefined
    ) {
      throw new Error("Wrong response format.");
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log("Participants info was not found.");

      return undefined;
    }

    throw new Error(`Error while requesting partisipants info (GET): ${error.message}.`);
  }
}
