# @asymetrix/v1-autotasks-flush

OpenZeppelin Defender autotask to flush a draw rewards.

## Development

### Env

We use [direnv](https://direnv.net) to manage environment variables. You'll
likely need to install it.

Copy `.envrc.example` and write down the env variables needed to run this
project.

```
cp .envrc.example .envrc
```

Once your env variables are setup, load them with:

```
direnv allow
```

### Autotasks

Depending on which autotask you wish to update, you need to set the following
env variables:

```
export CHAIN_ID=
export AUTOTASK_ID=
export DEFENDER_TEAM_API_KEY=
export DEFENDER_TEAM_SECRET_KEY=
export RELAYER_API_KEY=
export RELAYER_API_SECRET=
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
export AUTOTASK_ID=07bed0e1-15f3-4916-a891-b2d2eb8f37b4
```

### Run autotask

To run the autotask locally, run:

```
yarn start
```

### Update autotask

To update the autotask, run:

```
yarn update
```
