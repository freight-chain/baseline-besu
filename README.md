# besu2eth

for dealing with ethereum foundation mainnet and freight trust mainnet via
baseline protocol

# Packages

## Besu

- Hyperledger Besu Redis Plugin.
- Contracts deployed on both chains with the same addresses (mutable address).
- Cross-chain APIs (just a limited set of APIs that work on both chains.

## Contracts

#### Compiling

To compile your smart contracts run:

`npx waffle`

To compile using a custom configuration file run:

`npx waffle config.json`

Example configuration file looks like this (all fields optional):

```javascript
{
  "sourceDirectory": "./custom_contracts",
  "outputDirectory": "./custom_build",
  "nodeModulesDirectory": "./custom_node_modules"
}
```

#### Flattener

To flat your smart contracts run:

`npx waffle flatten`

In configuration file you can add optional field with path to flatten files:

```javascript
{
  "flattenOutputDirectory": "./custom_flatten"
}
```

#### Running tests

To run the tests run the following command:

`npx mocha`
