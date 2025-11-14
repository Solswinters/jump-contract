# Developer Guide

Guide for developers working with the Jump Token contract system.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git
- Basic Solidity knowledge
- Understanding of Hardhat

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd jump-contract
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp env.example .env
# Edit .env with your settings
```

4. Compile contracts:
```bash
npm run compile
```

## Project Structure

```
jump-contract/
├── contracts/          # Solidity contracts
│   ├── JumpToken.sol
│   ├── JumpAchievements.sol
│   ├── JumpTierSystem.sol
│   └── JumpGameController.sol
├── test/               # Test files
│   ├── helpers/       # Test utilities
│   ├── integration/   # Integration tests
│   ├── edge-cases/    # Edge case tests
│   └── security/      # Security tests
├── scripts/           # Deployment and utility scripts
├── docs/             # Documentation
└── hardhat.config.js # Hardhat configuration
```

## Development Workflow

### Writing Tests

1. Create test file in appropriate directory
2. Use test helpers for setup
3. Follow existing test patterns
4. Run tests: `npm test`

### Adding Features

1. Create feature branch
2. Implement feature
3. Write tests
4. Update documentation
5. Submit pull request

### Code Style

- Follow Solidity style guide
- Use NatSpec for documentation
- Run linter: `npm run lint`
- Format code: `npm run format`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/JumpToken.test.js

# Run with gas reporting
REPORT_GAS=true npm test
```

### Test Coverage

```bash
npm run coverage
```

## Deployment

### Local Network

```bash
# Start local node
npm run node

# Deploy (in another terminal)
npm run deploy:local
```

### Testnet

```bash
npm run deploy:testnet
```

### Mainnet

```bash
npm run deploy:mainnet
```

## Contract Interaction

### Using ethers.js

```javascript
const { ethers } = require("hardhat");

// Get contract instance
const jumpToken = await ethers.getContractAt("JumpToken", tokenAddress);

// Call function
const balance = await jumpToken.balanceOf(userAddress);

// Send transaction
await jumpToken.mint(userAddress, amount);
```

### Using Web3

```javascript
const Web3 = require("web3");
const web3 = new Web3(provider);

// Get contract instance
const contract = new web3.eth.Contract(abi, address);

// Call function
const balance = await contract.methods.balanceOf(userAddress).call();

// Send transaction
await contract.methods.mint(userAddress, amount).send({ from: sender });
```

## Debugging

### Using Hardhat Console

```bash
npx hardhat console --network localhost
```

### Viewing Events

```javascript
const filter = contract.filters.TokensMinted();
const events = await contract.queryFilter(filter);
```

### Gas Debugging

```bash
REPORT_GAS=true npm test
```

## Best Practices

1. **Always test locally first**
2. **Use testnet for integration testing**
3. **Review code before deployment**
4. **Document all changes**
5. **Follow security best practices**
6. **Keep dependencies updated**
7. **Write comprehensive tests**

## Common Tasks

### Adding a New Tier

```javascript
await tierSystem.createTier(
  6,                    // tier level
  10000,                // min score
  20000,                // max score
  ethers.parseEther("5000"), // token reward
  105                   // achievement ID
);
```

### Creating an Achievement

```javascript
await jumpAchievements.createAchievement(
  201,                  // achievement ID
  "Special Event",      // name
  "Participated in event", // description
  2,                    // category (Special Event)
  1,                    // rarity (Rare)
  true                  // transferable
);
```

### Granting Roles

```javascript
const MINTER_ROLE = await jumpToken.MINTER_ROLE();
await jumpToken.grantRole(MINTER_ROLE, minterAddress);
```

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Solidity Documentation](https://docs.soliditylang.org)
- [Ethers.js Documentation](https://docs.ethers.io)

