# @asymetrix/v1-autotasks-random-processor

OpenZeppelin Defender autotask to request random and process it according to
the finished draw info.

## Development

### Environment

We use [direnv](https://direnv.net) to manage environment variables. You'll
likely need to install it.

Copy `.envrc.example` and write down the environment variables needed to run
this project.

```
cp .envrc.example .envrc
```

Once your environment variables are setup, load them with:

```
direnv allow
```

### Autotasks

Depending on which autotask you wish to update, you need to set the following
environment variables:

```
export CHAIN_ID=
export AUTOTASK_ID=
export DEFENDER_TEAM_API_KEY=
export DEFENDER_TEAM_SECRET_KEY=
export RELAYER_API_KEY=
export RELAYER_API_SECRET=
export ETHEREUM_MAINNET_RPC_URL=
export ETHEREUM_GOERLI_RPC_URL=
export ASYMETRIX_API_URL=
export ASYMETRIX_API_AUTH_KEY=
export ASYMETRIX_API_JWT_SECRET=
```

Here are the currently deployed autotasks and their corresponding ID.

#### Mainnet

##### Ethereum

```
export CHAIN_ID=1
export AUTOTASK_ID=
```

#### Testnet

##### Goerli

```
export CHAIN_ID=5
export AUTOTASK_ID=bff807df-753f-4ecc-a11f-69cccd2c5ea0
```

### Run autotask

To run the autotask locally, run:

```
yarn start
```

NOTE: remove `"type": "module",` line from your `package.json` file before run.

### Update autotask

To update the autotask, run:

```
yarn update
```
