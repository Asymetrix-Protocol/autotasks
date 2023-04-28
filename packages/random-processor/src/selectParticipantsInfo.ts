import { ParticipantsInfo } from "./types";

import { BigNumber } from "ethers";

import Jwt from "jsonwebtoken";

import axios from "axios";

export async function selectParticipantsInfo(event: any, drawId: BigNumber): Promise<ParticipantsInfo> {
  console.log("Requesting participants info (picks number and IPFS hash) ...");

  try {
    const jwtToken: string = Jwt.sign(
      { apiKey: event.secrets.ASYMETRIX_API_AUTH_KEY },
      event.secrets.ASYMETRIX_API_JWT_SECRET,
      {
        expiresIn: "5m",
      },
    );
    const response: any = await axios.post(
      event.secrets.ASYMETRIX_API_URL + `draws/${drawId.toString()}/participants`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    console.log(response.data);

    if (!response || response.status != 200) {
      throw new Error("Undefined response or invalid response code (status).");
    }

    if (response.data.totalPicks === undefined || !response.data.participantsHash) {
      throw new Error("Wrong response format.");
    }

    console.log("Participants info requested successfully.");

    return {
      picksNumber: response.data.totalPicks,
      ipfsHash: response.data.participantsHash,
    };
  } catch (error: any) {
    throw new Error(`Error while requesting partisipants info (POST): ${error.message}.`);
  }
}
