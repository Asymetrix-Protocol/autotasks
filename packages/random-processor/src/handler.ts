import { DefenderRelayProvider, DefenderRelaySigner } from "defender-relay-client/lib/ethers";

import { Relayer, RelayerTransaction } from "defender-relay-client";

import { PopulatedTransaction } from "@ethersproject/contracts";

import { BigNumber } from "ethers";

import {
  selectParticipantsInfo,
  getLastUnpaidDrawId,
  requestRandomness,
  processRandomness,
  ParticipantsInfo,
  ProviderOptions,
  isFinishedDraw,
  ContractsBlob,
  getContracts,
  getDrawById,
  isEmptyDraw,
  Draw,
} from "./index";

export async function handler(event: any): Promise<void> {
  const provider: DefenderRelayProvider = new DefenderRelayProvider(event);
  const signer: DefenderRelaySigner = new DefenderRelaySigner(event, provider, { speed: "fastest" });
  const relayer: Relayer = new Relayer(event);
  const chainId: number = Number(process.env.CHAIN_ID);
  const rpc: string = chainId === 1 ? event.secrets.ETHEREUM_MAINNET_RPC_URL : event.secrets.ETHEREUM_GOERLI_RPC_URL;
  const contracts: ContractsBlob = getContracts(chainId);
  const config: ProviderOptions = { chainId, provider: signer };

  try {
    const lastUnpaidDrawId: BigNumber = BigNumber.from(await getLastUnpaidDrawId(contracts, config));

    console.log(`Last unpaid draw ID: ${lastUnpaidDrawId.toString()}.`);

    if (!(await isFinishedDraw(contracts, config, rpc, lastUnpaidDrawId))) {
      throw new Error(`Draw ${lastUnpaidDrawId.toString()} is not finished yet.`);
    }

    const draw: Draw = await getDrawById(contracts, config, lastUnpaidDrawId);
    let isEmpty: boolean = await isEmptyDraw(event, lastUnpaidDrawId);
    let populatedTransaction: PopulatedTransaction | undefined;

    if (BigNumber.from(draw.rngRequestInternalId).eq(BigNumber.from(0)) && !isEmpty) {
      console.log("Requesting randomness ...");

      const participantsInfo: ParticipantsInfo = await selectParticipantsInfo(event, lastUnpaidDrawId);

      isEmpty = await isEmptyDraw(event, lastUnpaidDrawId);

      populatedTransaction = await requestRandomness(
        contracts,
        config,
        lastUnpaidDrawId,
        participantsInfo.picksNumber,
        Buffer.from(participantsInfo.ipfsHash),
        isEmpty,
      );
    } else if (!isEmpty) {
      console.log("Processing randomness ...");

      populatedTransaction = await processRandomness(contracts, config, lastUnpaidDrawId);
    }

    console.log(`Populated transaction: ${populatedTransaction}.`);

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
      console.log("Transaction is not populated.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
