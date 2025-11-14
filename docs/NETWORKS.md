# Network Configuration Guide

Configuration details for different networks supported by Jump Token contracts.

## Supported Networks

### Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org
- **Currency**: ETH

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH

### Local Hardhat Network
- **Chain ID**: 1337
- **RPC URL**: http://127.0.0.1:8545
- **Explorer**: N/A
- **Currency**: ETH (test)

## Network Setup

### Adding Custom Network

Edit `hardhat.config.js`:

```javascript
networks: {
  customNetwork: {
    url: "YOUR_RPC_URL",
    accounts: [PRIVATE_KEY],
    chainId: CHAIN_ID,
    gasPrice: "auto"
  }
}
```

### Network-Specific Configuration

Different networks may require:
- Different gas prices
- Different block confirmations
- Different RPC endpoints
- Different explorer APIs

## RPC Providers

### Recommended Providers

- **Alchemy**: https://www.alchemy.com
- **Infura**: https://www.infura.io
- **QuickNode**: https://www.quicknode.com
- **Public RPC**: Base official endpoints

### Setting Up RPC

1. Get API key from provider
2. Add to `.env` file:
```env
BASE_MAINNET_RPC=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

## Gas Configuration

### Gas Price Settings

```javascript
gasPrice: "auto"  // Automatic gas price
// or
gasPrice: ethers.utils.parseUnits("0.1", "gwei")  // Fixed price
```

### Gas Limits

Default gas limits are usually sufficient, but can be adjusted:

```javascript
gas: 6000000  // Custom gas limit
```

## Verification

### Basescan Verification

1. Get API key from Basescan
2. Add to `.env`:
```env
BASESCAN_API_KEY=your_api_key
```

3. Run verification:
```bash
node scripts/verify.js
```

## Network-Specific Notes

### Base Mainnet
- Requires real ETH for gas
- Permanent deployments
- Higher gas costs
- Production environment

### Base Testnet
- Free testnet ETH available
- Can be reset
- Lower gas costs
- Testing environment

### Local Network
- Instant transactions
- Free gas
- Resettable
- Development only

## Troubleshooting

### Connection Issues
- Check RPC URL is correct
- Verify network is accessible
- Check API key if using provider

### Gas Issues
- Increase gas price
- Check network congestion
- Verify sufficient balance

## Resources

- [Base Network Docs](https://docs.base.org)
- [Hardhat Networks](https://hardhat.org/docs/config#networks)

