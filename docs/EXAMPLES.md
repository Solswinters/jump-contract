# Contract Interaction Examples

Practical examples for interacting with Jump Token contracts.

## Basic Token Operations

### Check Balance

```javascript
const balance = await jumpToken.balanceOf(userAddress);
console.log(`Balance: ${ethers.utils.formatEther(balance)} JUMP`);
```

### Transfer Tokens

```javascript
const tx = await jumpToken.transfer(recipientAddress, ethers.utils.parseEther("100"));
await tx.wait();
console.log("Transfer completed!");
```

### Approve and Transfer From

```javascript
// Approve
await jumpToken.approve(spenderAddress, ethers.utils.parseEther("50"));

// Transfer from (by spender)
await jumpToken.connect(spender).transferFrom(ownerAddress, recipientAddress, ethers.utils.parseEther("50"));
```

## Achievement Operations

### Check Achievement Balance

```javascript
const balance = await jumpAchievements.balanceOf(userAddress, achievementId);
console.log(`Achievement balance: ${balance}`);
```

### Get Achievement Metadata

```javascript
const achievement = await jumpAchievements.achievements(achievementId);
console.log(`Name: ${achievement.name}`);
console.log(`Description: ${achievement.description}`);
console.log(`Category: ${achievement.category}`);
console.log(`Rarity: ${achievement.rarity}`);
```

## Game Controller Operations

### Submit Player Score

```javascript
const tx = await gameController.submitScore(playerAddress, score);
await tx.wait();
console.log("Score submitted!");
```

### Get Player Statistics

```javascript
const [highestScore, highestTier, totalRewards] = 
  await gameController.getPlayerStats(playerAddress);

console.log(`Highest Score: ${highestScore}`);
console.log(`Highest Tier: ${highestTier}`);
console.log(`Total Rewards: ${ethers.utils.formatEther(totalRewards)} JUMP`);
```

### Batch Submit Scores

```javascript
const players = [player1, player2, player3];
const scores = [150, 500, 1000];

const tx = await gameController.batchSubmitScores(players, scores);
await tx.wait();
```

## Tier System Operations

### Get Tier for Score

```javascript
const tier = await tierSystem.getTierForScore(score);
console.log(`Tier: ${tier}`);
```

### Get Token Reward

```javascript
const reward = await tierSystem.getTokenReward(score);
console.log(`Reward: ${ethers.utils.formatEther(reward)} JUMP`);
```

### Get Achievement ID

```javascript
const achievementId = await tierSystem.getAchievementId(score);
console.log(`Achievement ID: ${achievementId}`);
```

## Event Listening

### Listen for Mint Events

```javascript
jumpToken.on("TokensMinted", (to, amount, minter, event) => {
  console.log(`Minted ${ethers.utils.formatEther(amount)} to ${to}`);
});
```

### Listen for Score Submissions

```javascript
gameController.on("ScoreSubmitted", (player, score, tier, event) => {
  console.log(`Player ${player} scored ${score} (Tier ${tier})`);
});
```

### Listen for Rewards

```javascript
gameController.on("RewardsClaimed", (player, tokenAmount, achievementId, event) => {
  console.log(`Player ${player} received ${ethers.utils.formatEther(tokenAmount)} JUMP`);
  if (achievementId > 0) {
    console.log(`Achievement ID: ${achievementId}`);
  }
});
```

## Complete Workflow Example

```javascript
async function completeGameFlow(playerAddress, score) {
  // 1. Submit score
  const tx1 = await gameController.submitScore(playerAddress, score);
  await tx1.wait();
  
  // 2. Get player stats
  const [highestScore, highestTier, totalRewards] = 
    await gameController.getPlayerStats(playerAddress);
  
  // 3. Get token balance
  const tokenBalance = await jumpToken.balanceOf(playerAddress);
  
  // 4. Get tier info
  const tier = await tierSystem.tiers(highestTier);
  const achievementId = tier.achievementId;
  
  // 5. Check achievement if applicable
  if (achievementId > 0) {
    const achievementBalance = await jumpAchievements.balanceOf(playerAddress, achievementId);
    console.log(`Achievement balance: ${achievementBalance}`);
  }
  
  return {
    score: highestScore,
    tier: highestTier,
    rewards: ethers.utils.formatEther(totalRewards),
    tokenBalance: ethers.utils.formatEther(tokenBalance)
  };
}
```

## Error Handling Example

```javascript
async function safeSubmitScore(playerAddress, score) {
  try {
    // Check if contract is paused
    const isPaused = await gameController.paused();
    if (isPaused) {
      throw new Error("Contract is paused");
    }
    
    // Submit score
    const tx = await gameController.submitScore(playerAddress, score);
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.transactionHash,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      return { success: false, error: "User rejected transaction" };
    } else if (error.message.includes("AccessControl")) {
      return { success: false, error: "Insufficient permissions" };
    } else {
      return { success: false, error: error.message };
    }
  }
}
```

