# Glossary

Terms and concepts used in the Jump Token contract system.

## Contracts

### JumpToken
ERC20 fungible token contract representing the game currency. Players earn JUMP tokens by achieving scores.

### JumpAchievements
ERC1155 multi-token contract for achievement badges and collectibles. Supports both fungible and non-fungible tokens.

### JumpTierSystem
Contract that defines score thresholds and calculates rewards based on player scores.

### JumpGameController
Main orchestrator contract that coordinates score submission and reward distribution.

## Token Standards

### ERC20
Ethereum standard for fungible tokens. Defines basic token functionality like transfer, balance, and approval.

### ERC1155
Ethereum standard for multi-token contracts. Can represent both fungible and non-fungible tokens in a single contract.

## Roles

### DEFAULT_ADMIN_ROLE
Full administrative control over the contract. Can grant/revoke other roles and perform critical operations.

### MINTER_ROLE
Permission to mint new tokens. Granted to the GameController for automated reward distribution.

### PAUSER_ROLE
Permission to pause and unpause contract operations. Used for emergency situations.

### GAME_OPERATOR_ROLE
Permission to submit player scores to the GameController.

### URI_SETTER_ROLE
Permission to update the URI for achievement metadata.

## Concepts

### Tier
Score range that determines token and achievement rewards. Players progress through tiers as scores increase.

### Achievement
Badge or collectible represented as an ERC1155 token. Can be transferable or soulbound (non-transferable).

### Soulbound
Non-transferable achievement that cannot be sent to other addresses. Permanently bound to the original recipient.

### Score
Player's game performance metric. Used to determine tier and calculate rewards.

### Reward
Tokens and achievements distributed to players based on their tier.

## Operations

### Minting
Creating new tokens and adding them to circulation. Only authorized addresses can mint.

### Burning
Destroying tokens by removing them from circulation. Reduces total supply.

### Pausing
Temporarily disabling contract operations. Used for emergencies or maintenance.

### Batch Operations
Processing multiple items in a single transaction to save gas costs.

## Security

### Reentrancy
Attack vector where malicious contract calls back into the original contract before state updates complete.

### Access Control
System of roles and permissions that restrict who can perform certain operations.

### Input Validation
Checking that function parameters meet requirements before processing.

## Network Terms

### Base
Ethereum Layer 2 network providing low gas costs and fast transactions.

### Testnet
Test network for development and testing. Uses free test tokens.

### Mainnet
Production network where real transactions occur. Requires real ETH for gas.

### Gas
Cost of executing transactions on the blockchain. Measured in wei or gwei.

## Development Terms

### Hardhat
Development environment for Ethereum smart contracts. Provides testing, compilation, and deployment tools.

### Solidity
Programming language for writing smart contracts on Ethereum.

### NatSpec
Natural Language Specification format for documenting Solidity code.

### ABI
Application Binary Interface. Describes how to interact with a contract.

## Events

### TokensMinted
Emitted when new tokens are minted. Includes recipient, amount, and minter.

### ScoreSubmitted
Emitted when a player score is submitted. Includes player, score, and tier.

### RewardsClaimed
Emitted when rewards are distributed. Includes player, token amount, and achievement ID.

### PlayerRegistered
Emitted when a new player is registered in the system.

