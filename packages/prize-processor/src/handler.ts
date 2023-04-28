import { DefenderRelayProvider, DefenderRelaySigner } from "defender-relay-client/lib/ethers";

import { Relayer, RelayerTransaction } from "defender-relay-client";

import { PopulatedTransaction } from "@ethersproject/contracts";

import { BigNumber } from "ethers";

import {
  getLastUnpaidDrawId,
  getParticipantsInfo,
  ParticipantsInfo,
  isFinishedDraw,
  ContractsBlob,
  selectWinners,
  getContracts,
  getDrawById,
  payWinners,
  Draw,
} from "./index";

export async function handler(event: any) {
  const provider: DefenderRelayProvider = new DefenderRelayProvider(event);
  const signer: DefenderRelaySigner = new DefenderRelaySigner(event, provider, { speed: "fastest" });
  const relayer: Relayer = new Relayer(event);
  const chainId: number = Number(process.env.CHAIN_ID?.trim());
  const rpc: string = chainId === 1 ? event.secrets.ETHEREUM_MAINNET_RPC_URL : event.secrets.ETHEREUM_GOERLI_RPC_URL;
  const contracts: ContractsBlob = getContracts(chainId);
  const config = { chainId, provider: signer };

  try {
    console.log(`Processing prizes ...`);

    const lastUnpaidDrawId: BigNumber = BigNumber.from(await getLastUnpaidDrawId(contracts, config));

    console.log(`Last unpaid draw ID: ${lastUnpaidDrawId.toString()}.`);

    if (!(await isFinishedDraw(contracts, config, rpc, lastUnpaidDrawId))) {
      throw new Error(`Draw ${lastUnpaidDrawId.toString()} is not finished yet.`);
    }

    const participantsInfo: ParticipantsInfo | undefined = await getParticipantsInfo(event, lastUnpaidDrawId);

    if (!participantsInfo) throw new Error("PrizeProcessor: get participants info request failed.");

    const draw: Draw = await getDrawById(contracts, config, lastUnpaidDrawId);
    let populatedTransaction: PopulatedTransaction | undefined;

    if (participantsInfo.isEmptyResult) {
      populatedTransaction = await payWinners(contracts, config, lastUnpaidDrawId, []);
    } else if (!BigNumber.from(draw.rngRequestInternalId).eq(BigNumber.from(0)) && !participantsInfo.isEmptyResult) {
      populatedTransaction = await payWinners(
        contracts,
        config,
        lastUnpaidDrawId,
        selectWinners(draw, participantsInfo),
      );
    } else {
      console.error(`Can not find RGN request for the draw with ID ${lastUnpaidDrawId.toString()}.`);
    }

    console.log(`Populated transaction: ${populatedTransaction}`);

    if (populatedTransaction) {
      const estimatedGas: number = (
        await signer.estimateGas({
          data: populatedTransaction.data,
          to: populatedTransaction.to,
        })
      ).toNumber();
      const transactionSentToNetwork: RelayerTransaction = await relayer.sendTransaction({
        data: populatedTransaction.data,
        to: populatedTransaction.to,
        gasLimit: estimatedGas + Math.ceil(estimatedGas * 0.1),
      });

      console.log(`Transaction hash: ${transactionSentToNetwork.hash}.`);
    } else {
      throw new Error("Transaction is not populated.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
