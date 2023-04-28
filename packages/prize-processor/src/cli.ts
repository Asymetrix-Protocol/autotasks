import { handler } from "./handler";

if (require.main === module) {
  const { RELAYER_API_KEY, RELAYER_API_SECRET } = process.env;
  const secrets: any = {
    ETHEREUM_MAINNET_RPC_URL: process.env.ETHEREUM_MAINNET_RPC_URL,
    ETHEREUM_GOERLI_RPC_URL: process.env.ETHEREUM_GOERLI_RPC_URL,
    ASYMETRIX_API_URL: process.env.ASYMETRIX_API_URL,
  };

  handler({
    apiKey: RELAYER_API_KEY,
    apiSecret: RELAYER_API_SECRET,
    secrets,
  })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export function main() {}
