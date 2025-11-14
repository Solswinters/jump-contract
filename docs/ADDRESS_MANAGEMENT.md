# Contract Address Management

Guide for managing and tracking contract addresses across deployments.

## Address Storage

### File Structure

Addresses are stored in JSON files:
```
deploy/
├── addresses-baseMainnet.json
├── addresses-baseTestnet.json
├── addresses-localhost.json
└── addresses.json.example
```

### Address File Format

```json
{
  "network": "baseMainnet",
  "deployedAt": "2025-01-01T00:00:00.000Z",
  "deployer": "0x...",
  "contracts": {
    "jumpToken": "0x...",
    "jumpAchievements": "0x...",
    "jumpTierSystem": "0x...",
    "jumpGameController": "0x..."
  }
}
```

## Saving Addresses

### Automatic Saving

The deployment script can be modified to automatically save addresses:

```javascript
// In deploy.js
const addresses = {
  network: hre.network.name,
  deployedAt: new Date().toISOString(),
  deployer: deployer.address,
  contracts: {
    jumpToken: jumpTokenAddress,
    jumpAchievements: jumpAchievementsAddress,
    jumpTierSystem: tierSystemAddress,
    jumpGameController: gameControllerAddress
  }
};

fs.writeFileSync(
  `deploy/addresses-${hre.network.name}.json`,
  JSON.stringify(addresses, null, 2)
);
```

### Manual Saving

Use the save script:
```bash
node scripts/save-addresses.js
```

## Loading Addresses

### From File

```bash
node scripts/load-addresses.js
```

### In Scripts

```javascript
const fs = require("fs");
const addresses = JSON.parse(
  fs.readFileSync("deploy/addresses-baseMainnet.json", "utf8")
);

const jumpToken = addresses.contracts.jumpToken;
```

## Environment Variables

### Setting from Addresses

```bash
export JUMP_TOKEN_ADDRESS=0x...
export JUMP_ACHIEVEMENTS_ADDRESS=0x...
export JUMP_TIER_SYSTEM_ADDRESS=0x...
export GAME_CONTROLLER_ADDRESS=0x...
```

### Loading Script

```bash
source <(node scripts/load-addresses.js | grep export)
```

## Best Practices

1. **Always save addresses after deployment**
2. **Version control address files** (but not private keys)
3. **Document deployment details**
4. **Keep addresses organized by network**
5. **Verify addresses before use**

## Verification

Always verify contract addresses:
- Check on block explorer
- Verify contract code matches
- Confirm deployment transaction
- Test contract interactions

## Migration

When upgrading contracts:
- Archive old addresses
- Document migration path
- Update all references
- Notify stakeholders

