# @asymetrix/v1-autotasks-vrf-coordinator-fulfiller

OpenZeppelin Defender autotask to fulfill requests inside of the mock
VRFCoordinator contract. Must be used only in testing environment (not in the
mainnet).

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

#### Testnet

##### Goerli

```
export CHAIN_ID=5
export AUTOTASK_ID=d4fae0b8-0b13-46b6-a320-091612911899
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
