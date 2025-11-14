# Deployment Guide

This guide covers deploying the Jump Token contracts to Base network.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn installed
- Hardhat configured
- Base network RPC access
- Private key with sufficient ETH for gas
- Basescan API key (for verification)

## Environment Setup

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Configure your `.env` file:
```env
PRIVATE_KEY=your_private_key_here
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_TESTNET_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
```

## Installation

```bash
npm install
```

## Compilation

```bash
npm run compile
```

## Testing

Run tests before deployment:
```bash
npm test
```

## Deployment Steps

### 1. Deploy to Base Testnet

```bash
npm run deploy:testnet
```

This will:
- Deploy JumpToken
- Deploy JumpAchievements
- Deploy JumpTierSystem
- Deploy JumpGameController
- Display all contract addresses

### 2. Setup Roles

After deployment, configure roles:
```bash
export JUMP_TOKEN_ADDRESS=<deployed_address>
export JUMP_ACHIEVEMENTS_ADDRESS=<deployed_address>
export GAME_CONTROLLER_ADDRESS=<deployed_address>
node scripts/setup-roles.js
```

### 3. Initialize Achievements

```bash
export JUMP_ACHIEVEMENTS_ADDRESS=<deployed_address>
node scripts/initialize-achievements.js
```

### 4. Verify Contracts

```bash
export JUMP_TOKEN_ADDRESS=<deployed_address>
export JUMP_ACHIEVEMENTS_ADDRESS=<deployed_address>
export JUMP_TIER_SYSTEM_ADDRESS=<deployed_address>
export GAME_CONTROLLER_ADDRESS=<deployed_address>
node scripts/verify.js
```

### 5. Deploy to Base Mainnet

**⚠️ WARNING: Mainnet deployment is irreversible. Test thoroughly on testnet first.**

```bash
npm run deploy:mainnet
```

## Post-Deployment Checklist

- [ ] All contracts deployed successfully
- [ ] Roles configured correctly
- [ ] Achievements initialized
- [ ] Contracts verified on Basescan
- [ ] Test score submission
- [ ] Verify token minting
- [ ] Verify achievement minting
- [ ] Check event emissions
- [ ] Test pause functionality
- [ ] Document all addresses

## Contract Addresses

After deployment, save all addresses:

```env
JUMP_TOKEN_ADDRESS=0x...
JUMP_ACHIEVEMENTS_ADDRESS=0x...
JUMP_TIER_SYSTEM_ADDRESS=0x...
JUMP_GAME_CONTROLLER_ADDRESS=0x...
```

## Troubleshooting

### Deployment Fails

- Check network connectivity
- Verify sufficient ETH balance
- Check gas price settings
- Review error messages

### Verification Fails

- Ensure Basescan API key is correct
- Check constructor arguments match
- Verify network matches (testnet/mainnet)

### Role Setup Fails

- Verify contract addresses are correct
- Check deployer has admin role
- Ensure contracts are deployed

## Gas Estimation

Estimated gas costs (approximate):
- JumpToken: ~1,500,000 gas
- JumpAchievements: ~2,000,000 gas
- JumpTierSystem: ~800,000 gas
- JumpGameController: ~2,500,000 gas

Total: ~6,800,000 gas

## Security Considerations

- Never commit private keys
- Use hardware wallets for mainnet
- Test all functionality on testnet
- Review all transactions before signing
- Keep deployment keys secure

## Support

For issues or questions, please open an issue on GitHub.

