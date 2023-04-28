# @asymetrix/v1-autotasks-draw-beacon

OpenZeppelin Defender autotask to start a new draw.

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
export AUTOTASK_ID=980d15a2-1c2e-4ce7-9a21-f46e1cb05a1e
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
