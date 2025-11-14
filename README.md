# Jump Token Game Contract System

A comprehensive blockchain-based reward system for the Jump game, built on Base network using Solidity smart contracts.

## Overview

The Jump Token system provides a dual-token reward mechanism:
- **ERC20 Token (JUMP)**: Fungible game currency earned based on player scores
- **ERC1155 Achievements**: Unique badges and collectibles for milestone achievements

## Features

- 🎮 **Score-Based Rewards**: Tiered reward system based on game performance
- 🏆 **Achievement System**: Collectible badges for milestones and special events
- 🔐 **Secure Authorization**: Role-based access control for minting and management
- ⚡ **Gas Optimized**: Efficient contract design for minimal transaction costs
- 🛡️ **Battle-Tested Security**: Comprehensive security features and audit preparation
- 🔄 **Upgradeable**: Proxy pattern for future improvements

## Score Tiers

| Tier | Score Range | JUMP Tokens | Achievement Badge |
|------|------------|-------------|-------------------|
| 1    | 0-99       | 10          | None              |
| 2    | 100-499    | 50          | Bronze Badge      |
| 3    | 500-999    | 150         | Silver Badge      |
| 4    | 1000-4999  | 500         | Gold Badge        |
| 5    | 5000+      | 2000        | Diamond Badge     |

## Technology Stack

- **Solidity**: ^0.8.20
- **Framework**: Hardhat
- **Libraries**: OpenZeppelin Contracts v5.x
- **Network**: Base (Ethereum L2)
- **Testing**: Chai/Mocha with 100% coverage goal

## Project Structure

```
jump-contract/
├── contracts/          # Smart contract source files
├── test/              # Comprehensive test suite
├── scripts/           # Deployment and utility scripts
├── deploy/            # Deployment configurations
├── docs/              # Additional documentation
└── hardhat.config.js  # Hardhat configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd jump-contract

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
```

### Configuration

Update the `.env` file with your settings:
- `PRIVATE_KEY`: Your deployer wallet private key
- `BASE_MAINNET_RPC`: Base mainnet RPC URL
- `BASE_TESTNET_RPC`: Base testnet RPC URL
- `BASESCAN_API_KEY`: For contract verification

## Development

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run coverage
```

### Lint Contracts

```bash
npm run lint
```

## Deployment

### Local Network

```bash
# Start local Hardhat node
npm run node

# Deploy to local network (in another terminal)
npm run deploy:local
```

### Base Testnet

```bash
npm run deploy:testnet
```

### Base Mainnet

```bash
npm run deploy:mainnet
```

## Contract Architecture

### Core Contracts

1. **JumpToken (ERC20)** - Main game currency token
2. **JumpAchievements (ERC1155)** - Achievement badge system
3. **JumpGameController** - Authorized minting and reward distribution
4. **JumpAccessControl** - Role-based permission management
5. **JumpTierSystem** - Score tier configuration and validation

### Security Features

- ✅ ReentrancyGuard protection
- ✅ Pausable functionality for emergencies
- ✅ Role-based access control
- ✅ Rate limiting on critical operations
- ✅ Input validation and sanitization
- ✅ Comprehensive event logging

## Testing

The project includes extensive test coverage:
- Unit tests for all contracts
- Integration tests for contract interactions
- Edge case and boundary testing
- Gas optimization tests
- Security vulnerability tests

## Contributing

Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting pull requests.

## Security

For security concerns, please review our [Security Policy](docs/SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **Documentation**: [docs/](docs/)
- **Base Network**: https://base.org
- **OpenZeppelin**: https://www.openzeppelin.com/contracts

## Support

For questions and support, please open an issue in the repository.

---

Built with ❤️ for the Jump gaming community

