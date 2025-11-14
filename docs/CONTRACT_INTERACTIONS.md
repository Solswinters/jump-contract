# Contract Interactions Guide

Comprehensive guide for interacting with Jump Token contracts.

## Overview

This guide covers how to interact with all Jump Token contracts from a frontend application or script.

## Setup

### Install Dependencies

```bash
npm install ethers
# or
npm install web3
```

### Connect to Network

```javascript
// Using ethers.js
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Using web3.js
const Web3 = require("web3");
const web3 = new Web3("https://sepolia.base.org");
```

## JumpToken (ERC20)

### Get Contract Instance

```javascript
const JUMP_TOKEN_ADDRESS = "0x...";
const JUMP_TOKEN_ABI = [...]; // ABI from artifacts

const jumpToken = new ethers.Contract(
  JUMP_TOKEN_ADDRESS,
  JUMP_TOKEN_ABI,
  signer
);
```

### Read Operations

```javascript
// Get token name
const name = await jumpToken.name();

// Get token symbol
const symbol = await jumpToken.symbol();

// Get decimals
const decimals = await jumpToken.decimals();

// Get total supply
const totalSupply = await jumpToken.totalSupply();

// Get balance
const balance = await jumpToken.balanceOf(userAddress);

// Get allowance
const allowance = await jumpToken.allowance(ownerAddress, spenderAddress);
```

### Write Operations

```javascript
// Transfer tokens
const tx = await jumpToken.transfer(recipientAddress, amount);
await tx.wait();

// Approve spender
const approveTx = await jumpToken.approve(spenderAddress, amount);
await approveTx.wait();

// Transfer from (requires approval)
const transferFromTx = await jumpToken.transferFrom(
  fromAddress,
  toAddress,
  amount
);
await transferFromTx.wait();

// Burn tokens
const burnTx = await jumpToken.burn(amount);
await burnTx.wait();
```

### Events

```javascript
// Listen for Transfer events
jumpToken.on("Transfer", (from, to, value, event) => {
  console.log(`Transfer: ${value} from ${from} to ${to}`);
});

// Listen for Approval events
jumpToken.on("Approval", (owner, spender, value, event) => {
  console.log(`Approval: ${value} from ${owner} to ${spender}`);
});
```

## JumpAchievements (ERC1155)

### Get Contract Instance

```javascript
const JUMP_ACHIEVEMENTS_ADDRESS = "0x...";
const jumpAchievements = new ethers.Contract(
  JUMP_ACHIEVEMENTS_ADDRESS,
  JUMP_ACHIEVEMENTS_ABI,
  signer
);
```

### Read Operations

```javascript
// Get balance of specific achievement
const balance = await jumpAchievements.balanceOf(userAddress, achievementId);

// Get balances of multiple achievements
const balances = await jumpAchievements.balanceOfBatch(
  [userAddress, userAddress],
  [achievementId1, achievementId2]
);

// Get URI for achievement
const uri = await jumpAchievements.uri(achievementId);

// Check if achievement exists
const exists = await jumpAchievements.achievements(achievementId);
```

### Write Operations

```javascript
// Transfer achievement
const tx = await jumpAchievements.safeTransferFrom(
  fromAddress,
  toAddress,
  achievementId,
  amount,
  "0x" // data
);
await tx.wait();

// Batch transfer
const batchTx = await jumpAchievements.safeBatchTransferFrom(
  fromAddress,
  toAddress,
  [achievementId1, achievementId2],
  [amount1, amount2],
  "0x"
);
await batchTx.wait();
```

## JumpGameController

### Get Contract Instance

```javascript
const GAME_CONTROLLER_ADDRESS = "0x...";
const gameController = new ethers.Contract(
  GAME_CONTROLLER_ADDRESS,
  GAME_CONTROLLER_ABI,
  signer
);
```

### Submit Score

```javascript
// Submit score for player
const tx = await gameController.submitScore(
  playerAddress,
  score,
  { gasLimit: 500000 }
);
await tx.wait();

// Batch submit scores
const batchTx = await gameController.batchSubmitScores(
  [player1, player2, player3],
  [score1, score2, score3]
);
await batchTx.wait();
```

### Get Player Stats

```javascript
const stats = await gameController.getPlayerStats(playerAddress);
console.log("Highest Score:", stats.highestScore.toString());
console.log("Highest Tier:", stats.highestTier.toString());
console.log("Total Rewards:", stats.totalRewardsClaimed.toString());
```

### Events

```javascript
// Listen for score submissions
gameController.on("ScoreSubmitted", (player, score, tier, event) => {
  console.log(`Player ${player} scored ${score}, tier ${tier}`);
});

// Listen for rewards claimed
gameController.on("RewardsClaimed", (player, tokenAmount, achievementId, event) => {
  console.log(`Player ${player} claimed ${tokenAmount} tokens and achievement ${achievementId}`);
});
```

## JumpTierSystem

### Get Contract Instance

```javascript
const TIER_SYSTEM_ADDRESS = "0x...";
const tierSystem = new ethers.Contract(
  TIER_SYSTEM_ADDRESS,
  TIER_SYSTEM_ABI,
  signer
);
```

### Query Tiers

```javascript
// Get tier for score
const tier = await tierSystem.getTierForScore(score);
console.log("Tier:", tier.toString());

// Get token reward for tier
const tokenReward = await tierSystem.getTokenReward(tier);
console.log("Token Reward:", tokenReward.toString());

// Get achievement ID for tier
const achievementId = await tierSystem.getAchievementId(tier);
console.log("Achievement ID:", achievementId.toString());
```

## Error Handling

### Common Errors

```javascript
try {
  const tx = await jumpToken.transfer(recipient, amount);
  await tx.wait();
} catch (error) {
  if (error.message.includes("insufficient balance")) {
    console.error("Insufficient balance");
  } else if (error.message.includes("paused")) {
    console.error("Contract is paused");
  } else {
    console.error("Error:", error.message);
  }
}
```

### Revert Reasons

```javascript
try {
  await jumpToken.mint(userAddress, amount);
} catch (error) {
  // Parse revert reason
  const reason = error.reason || error.message;
  console.error("Revert reason:", reason);
}
```

## Gas Estimation

### Estimate Gas

```javascript
// Estimate gas for transaction
const gasEstimate = await jumpToken.estimateGas.transfer(
  recipientAddress,
  amount
);
console.log("Gas estimate:", gasEstimate.toString());

// Get gas price
const gasPrice = await provider.getFeeData();
console.log("Gas price:", gasPrice.gasPrice.toString());
```

## Best Practices

### 1. Always Check Allowance

```javascript
const allowance = await jumpToken.allowance(owner, spender);
if (allowance < amount) {
  // Approve first
  await jumpToken.approve(spender, amount);
}
```

### 2. Handle Events

```javascript
// Set up event listeners before transactions
jumpToken.on("Transfer", handleTransfer);

// Remove listeners when done
jumpToken.removeAllListeners("Transfer");
```

### 3. Confirm Transactions

```javascript
const tx = await jumpToken.transfer(recipient, amount);
console.log("Transaction hash:", tx.hash);

// Wait for confirmation
const receipt = await tx.wait();
console.log("Confirmed in block:", receipt.blockNumber);
```

### 4. Error Recovery

```javascript
async function transferWithRetry(recipient, amount, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const tx = await jumpToken.transfer(recipient, amount);
      return await tx.wait();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Examples

### Complete Workflow

```javascript
async function completeGameFlow(playerAddress, score) {
  // 1. Submit score
  const submitTx = await gameController.submitScore(playerAddress, score);
  await submitTx.wait();
  
  // 2. Get player stats
  const stats = await gameController.getPlayerStats(playerAddress);
  
  // 3. Check token balance
  const tokenBalance = await jumpToken.balanceOf(playerAddress);
  
  // 4. Check achievements
  const achievementId = await tierSystem.getAchievementId(stats.highestTier);
  const achievementBalance = await jumpAchievements.balanceOf(
    playerAddress,
    achievementId
  );
  
  return {
    tier: stats.highestTier.toString(),
    tokens: tokenBalance.toString(),
    achievement: achievementBalance.toString()
  };
}
```

## Resources

- [ethers.js Documentation](https://docs.ethers.org/)
- [web3.js Documentation](https://web3js.readthedocs.io/)
- [Base Network Docs](https://docs.base.org/)

