# Quick Start Guide

Get up and running with Jump Token contracts in minutes.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

## Installation

```bash
# Clone repository
git clone <repository-url>
cd jump-contract

# Install dependencies
npm install
```

## Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env with your settings
# Add PRIVATE_KEY, API keys, etc.
```

## Compile Contracts

```bash
npm run compile
```

## Run Tests

```bash
# Run all tests
npm test

# Run specific test
npx hardhat test test/JumpToken.test.js
```

## Local Development

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy locally
npx hardhat run scripts/deploy.js --network localhost
```

## Deploy to Testnet

```bash
# Deploy to Base Sepolia
npm run deploy:testnet
```

## Next Steps

1. **Read the documentation**
   - [Architecture](ARCHITECTURE.md)
   - [API Reference](API_REFERENCE.md)
   - [Deployment Guide](DEPLOYMENT.md)

2. **Explore the contracts**
   - JumpToken.sol
   - JumpAchievements.sol
   - JumpTierSystem.sol
   - JumpGameController.sol

3. **Run tests**
   - Unit tests
   - Integration tests
   - Security tests

4. **Deploy and test**
   - Deploy to testnet
   - Test interactions
   - Verify contracts

## Common Commands

```bash
# Compile
npm run compile

# Test
npm test

# Deploy
npm run deploy:testnet

# Lint
npm run lint

# Format
npm run format

# Coverage
npm run coverage
```

## Getting Help

- Check [Troubleshooting](TROUBLESHOOTING.md)
- Review [FAQ](FAQ.md)
- Read [Developer Guide](DEVELOPER_GUIDE.md)

## Resources

- [Hardhat Docs](https://hardhat.org/docs)
- [Base Network](https://docs.base.org)
- [OpenZeppelin](https://docs.openzeppelin.com)

