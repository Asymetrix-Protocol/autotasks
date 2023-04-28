import { DefenderRelayProvider, DefenderRelaySigner } from "defender-relay-client/lib/ethers";

import { Relayer, RelayerParams, RelayerTransaction } from "defender-relay-client";

import { PopulatedTransaction } from "@ethersproject/contracts";

import { fulfill, getContracts, ContractsBlob } from "./index";

export async function handler(event: RelayerParams): Promise<void> {
  const provider: DefenderRelayProvider = new DefenderRelayProvider(event);
  const signer: DefenderRelaySigner = new DefenderRelaySigner(event, provider, { speed: "fastest" });
  const relayer: Relayer = new Relayer(event);
  const chainId: number = Number(process.env.CHAIN_ID);
  const contracts: ContractsBlob = getContracts(chainId);

  try {
    console.log(`Fulfilling randomness ...`);

    const populatedTransaction: PopulatedTransaction | undefined = await fulfill(contracts, {
      chainId,
      provider: signer,
    });

    console.log("Populated transaction: ", populatedTransaction);

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

      console.log("Transaction hash: ", transactionSentToNetwork.hash);
    } else {
      throw new Error("VRFCoordinatorFulfiller: Transaction is not populated");
    }
  } catch (error) {
    console.log(error);
  }
}
