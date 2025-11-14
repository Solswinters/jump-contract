# Upgrade Guide

Guide for upgrading Jump Token contracts using the UUPS proxy pattern.

## Overview

The upgradeable contracts use OpenZeppelin's UUPS (Universal Upgradeable Proxy Standard) pattern, which allows for:
- State preservation during upgrades
- Gas-efficient upgrades
- Controlled upgrade authorization

## Architecture

### Proxy Pattern

```
User → Proxy Contract → Implementation Contract
```

- **Proxy Contract**: Stores state, delegates calls to implementation
- **Implementation Contract**: Contains logic, can be upgraded

## Upgrade Process

### 1. Prepare New Implementation

```solidity
// contracts/upgradeable/JumpTokenUpgradeableV2.sol
contract JumpTokenUpgradeableV2 is JumpTokenUpgradeable {
    // Add new state variables
    uint256 public newFeature;
    
    // Initialize V2
    function initializeV2() public reinitializer(2) {
        newFeature = 0;
    }
    
    // New functions
    function setNewFeature(uint256 value) external {
        newFeature = value;
    }
}
```

### 2. Deploy New Implementation

```javascript
// scripts/upgrade-token.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0x..."; // Your proxy address
  
  const JumpTokenUpgradeableV2 = await ethers.getContractFactory("JumpTokenUpgradeableV2");
  
  // Upgrade proxy to new implementation
  const upgraded = await upgrades.upgradeProxy(proxyAddress, JumpTokenUpgradeableV2);
  
  console.log("Upgraded to:", await upgraded.getAddress());
  
  // Initialize V2 if needed
  await upgraded.initializeV2();
}
```

### 3. Verify Upgrade

```javascript
// Check implementation address
const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
console.log("New implementation:", implementationAddress);

// Test new functionality
const token = await ethers.getContractAt("JumpTokenUpgradeableV2", proxyAddress);
await token.setNewFeature(100);
console.log("New feature:", await token.getNewFeature());
```

## Storage Layout Rules

### ⚠️ CRITICAL: Storage Layout Preservation

When upgrading, you **MUST** preserve the storage layout:

1. **Never remove state variables**
2. **Never change variable order**
3. **Never change variable types**
4. **Only append new variables at the end**

### ✅ Correct Upgrade

```solidity
// V1
contract V1 {
    uint256 public a;
    uint256 public b;
}

// V2 - Correct
contract V2 is V1 {
    uint256 public c; // New variable at end
}
```

### ❌ Incorrect Upgrade

```solidity
// V1
contract V1 {
    uint256 public a;
    uint256 public b;
}

// V2 - WRONG!
contract V2 is V1 {
    uint256 public c; // Added in middle
    uint256 public b; // Moved - WRONG!
    uint256 public a; // Moved - WRONG!
}
```

## Upgrade Authorization

Only addresses with `UPGRADER_ROLE` can upgrade:

```javascript
const UPGRADER_ROLE = await token.UPGRADER_ROLE();
await token.grantRole(UPGRADER_ROLE, newUpgraderAddress);
```

## Testing Upgrades

### Local Testing

```bash
# Deploy V1
npx hardhat run scripts/deploy-upgradeable.js --network localhost

# Upgrade to V2
npx hardhat run scripts/upgrade-token.js --network localhost

# Run tests
npx hardhat test test/upgradeable/
```

### Testnet Testing

1. Deploy to testnet
2. Test all functionality
3. Upgrade to V2
4. Verify state preservation
5. Test new features
6. Monitor for issues

## Best Practices

### 1. Always Test Locally First

- Deploy V1 locally
- Test all functions
- Upgrade to V2
- Verify state preservation
- Test new features

### 2. Use Multi-Signature for Upgrades

```javascript
// Use Gnosis Safe or similar
const safe = await ethers.getContractAt("GnosisSafe", safeAddress);
await safe.submitTransaction(
  proxyAddress,
  0,
  upgradeCalldata,
  operation,
  safeThreshold,
  signatures
);
```

### 3. Implement Timelock

```solidity
contract TimelockController {
    function schedule(
        address target,
        bytes calldata data,
        uint256 delay
    ) external;
}
```

### 4. Document Changes

- What changed?
- Why was it changed?
- What are the risks?
- How to rollback?

### 5. Monitor After Upgrade

- Check all functions work
- Monitor events
- Check gas usage
- Monitor for errors

## Rollback Procedure

If upgrade fails:

1. **Pause contract** (if possible)
2. **Deploy previous implementation**
3. **Upgrade proxy back**
4. **Verify functionality**
5. **Investigate issue**

```javascript
// Rollback to previous implementation
const previousImpl = "0x..."; // Previous implementation address
await upgrades.upgradeProxy(proxyAddress, previousImpl);
```

## Security Considerations

### Risks

1. **Storage Collision**: Incorrect storage layout
2. **Function Selector Collision**: New function conflicts
3. **Initialization Attacks**: Re-initialization vulnerabilities
4. **Upgrade Authorization**: Unauthorized upgrades

### Mitigations

1. **Storage Layout Checks**: Use `@openzeppelin/upgrades-core`
2. **Function Selector Checks**: Verify no conflicts
3. **Initializer Pattern**: Use `reinitializer`
4. **Multi-Sig**: Require multiple signatures
5. **Timelock**: Add delay for upgrades

## Tools

### OpenZeppelin Upgrades Plugin

```bash
npm install --save-dev @openzeppelin/hardhat-upgrades
```

### Storage Layout Validation

```bash
npx hardhat verify-storage-layout
```

### Upgrade Safety Checks

```javascript
const { validateUpgrade } = require("@openzeppelin/upgrades-core");

await validateUpgrade(
  oldImplementation,
  newImplementation,
  { kind: "uups" }
);
```

## Examples

### Adding New Function

```solidity
// V2 adds new function
function newFunction() external {
    // Implementation
}
```

### Modifying Logic

```solidity
// V2 modifies existing function
function mint(address to, uint256 amount) external override {
    // New logic
    require(amount > 0, "Amount must be positive");
    super.mint(to, amount);
}
```

### Adding State Variable

```solidity
// V2 adds new state
uint256 public newStateVariable;

function initializeV2() public reinitializer(2) {
    newStateVariable = 100;
}
```

## Resources

- [OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades-plugins/1.x/)
- [UUPS Pattern](https://eips.ethereum.org/EIPS/eip-1822)
- [Storage Layout](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)

