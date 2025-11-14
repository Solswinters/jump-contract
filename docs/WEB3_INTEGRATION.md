# Web3 Integration Guide

Guide for integrating Jump Token contracts into web3 applications.

## Prerequisites

- Web3 library (ethers.js, web3.js, or similar)
- Provider connection (MetaMask, WalletConnect, etc.)
- Contract ABIs
- Contract addresses

## Setup

### Install Dependencies

```bash
npm install ethers
# or
npm install web3
```

### Get Contract ABIs

ABIs are generated in `artifacts/contracts/` after compilation.

```javascript
const JumpTokenABI = require("./artifacts/contracts/JumpToken.sol/JumpToken.json").abi;
```

## Using ethers.js

### Connect to Contract

```javascript
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const jumpTokenAddress = "0x...";
const jumpToken = new ethers.Contract(jumpTokenAddress, JumpTokenABI, signer);
```

### Read Operations

```javascript
// Get balance
const balance = await jumpToken.balanceOf(userAddress);
const formatted = ethers.utils.formatEther(balance);

// Get total supply
const totalSupply = await jumpToken.totalSupply();

// Check if paused
const isPaused = await jumpToken.paused();
```

### Write Operations

```javascript
// Mint tokens (requires MINTER_ROLE)
const tx = await jumpToken.mint(userAddress, ethers.utils.parseEther("100"));
await tx.wait();

// Transfer tokens
const tx = await jumpToken.transfer(recipientAddress, ethers.utils.parseEther("50"));
await tx.wait();

// Burn tokens
const tx = await jumpToken.burn(ethers.utils.parseEther("10"));
await tx.wait();
```

### Listen to Events

```javascript
// Listen for mint events
jumpToken.on("TokensMinted", (to, amount, minter, event) => {
  console.log(`Tokens minted: ${ethers.utils.formatEther(amount)} to ${to}`);
});

// Listen for transfer events
jumpToken.on("Transfer", (from, to, value, event) => {
  console.log(`Transfer: ${ethers.utils.formatEther(value)} from ${from} to ${to}`);
});
```

## Using web3.js

### Connect to Contract

```javascript
import Web3 from "web3";

const web3 = new Web3(window.ethereum);
const jumpToken = new web3.eth.Contract(JumpTokenABI, jumpTokenAddress);
```

### Read Operations

```javascript
// Get balance
const balance = await jumpToken.methods.balanceOf(userAddress).call();
const formatted = web3.utils.fromWei(balance, "ether");

// Get total supply
const totalSupply = await jumpToken.methods.totalSupply().call();
```

### Write Operations

```javascript
// Mint tokens
await jumpToken.methods.mint(userAddress, web3.utils.toWei("100", "ether"))
  .send({ from: userAddress });

// Transfer tokens
await jumpToken.methods.transfer(recipientAddress, web3.utils.toWei("50", "ether"))
  .send({ from: userAddress });
```

## Game Controller Integration

### Submit Score

```javascript
const gameController = new ethers.Contract(
  gameControllerAddress,
  GameControllerABI,
  signer
);

// Submit player score
const tx = await gameController.submitScore(playerAddress, score);
await tx.wait();
```

### Get Player Stats

```javascript
const [highestScore, highestTier, totalRewards] = 
  await gameController.getPlayerStats(playerAddress);
```

## Achievement Integration

### Check Achievement Balance

```javascript
const jumpAchievements = new ethers.Contract(
  achievementsAddress,
  JumpAchievementsABI,
  signer
);

const balance = await jumpAchievements.balanceOf(userAddress, achievementId);
```

### Get Achievement Metadata

```javascript
const achievement = await jumpAchievements.achievements(achievementId);
console.log(achievement.name);
console.log(achievement.description);
```

## Tier System Integration

### Get Tier for Score

```javascript
const tierSystem = new ethers.Contract(
  tierSystemAddress,
  TierSystemABI,
  provider
);

const tier = await tierSystem.getTierForScore(score);
const tokenReward = await tierSystem.getTokenReward(score);
const achievementId = await tierSystem.getAchievementId(score);
```

## Error Handling

```javascript
try {
  const tx = await jumpToken.mint(userAddress, amount);
  await tx.wait();
} catch (error) {
  if (error.code === "ACTION_REJECTED") {
    console.log("User rejected transaction");
  } else if (error.message.includes("AccessControl")) {
    console.log("Insufficient permissions");
  } else {
    console.error("Error:", error);
  }
}
```

## Best Practices

1. **Always check contract state** (paused/unpaused)
2. **Handle user rejection** gracefully
3. **Show transaction status** to users
4. **Validate inputs** before transactions
5. **Use events** for UI updates
6. **Cache contract instances** when possible
7. **Handle network errors** appropriately

## Example: Complete Integration

```javascript
class JumpTokenIntegration {
  constructor(provider, contractAddresses) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.contracts = {
      token: new ethers.Contract(contractAddresses.token, TokenABI, this.signer),
      achievements: new ethers.Contract(contractAddresses.achievements, AchievementsABI, this.signer),
      gameController: new ethers.Contract(contractAddresses.gameController, GameControllerABI, this.signer),
      tierSystem: new ethers.Contract(contractAddresses.tierSystem, TierSystemABI, provider)
    };
  }
  
  async getPlayerData(playerAddress) {
    const [score, tier, rewards] = await this.contracts.gameController.getPlayerStats(playerAddress);
    const tokenBalance = await this.contracts.token.balanceOf(playerAddress);
    
    return {
      score: score.toString(),
      tier: tier.toString(),
      rewards: ethers.utils.formatEther(rewards),
      tokenBalance: ethers.utils.formatEther(tokenBalance)
    };
  }
  
  async submitScore(playerAddress, score) {
    const tx = await this.contracts.gameController.submitScore(playerAddress, score);
    await tx.wait();
    return tx.hash;
  }
}
```

## Resources

- [ethers.js Documentation](https://docs.ethers.io)
- [web3.js Documentation](https://web3js.readthedocs.io)
- [MetaMask Integration](https://docs.metamask.io)

