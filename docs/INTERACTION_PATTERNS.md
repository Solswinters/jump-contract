# Contract Interaction Patterns

Common patterns for interacting with Jump Token contracts.

## Reading Contract State

### Get Token Balance

```javascript
const balance = await jumpToken.balanceOf(userAddress);
const formatted = ethers.utils.formatEther(balance);
```

### Get Player Stats

```javascript
const [score, tier, rewards] = await gameController.getPlayerStats(playerAddress);
```

### Get Tier Information

```javascript
const tier = await tierSystem.getTierForScore(score);
const reward = await tierSystem.getTokenReward(score);
const achievementId = await tierSystem.getAchievementId(score);
```

## Writing to Contracts

### Submit Score

```javascript
const tx = await gameController.submitScore(playerAddress, score);
await tx.wait();
```

### Mint Tokens

```javascript
const tx = await jumpToken.mint(recipientAddress, ethers.utils.parseEther("100"));
await tx.wait();
```

### Transfer Tokens

```javascript
const tx = await jumpToken.transfer(recipientAddress, ethers.utils.parseEther("50"));
await tx.wait();
```

## Event Listening

### Listen for Events

```javascript
// Listen for score submissions
gameController.on("ScoreSubmitted", (player, score, tier, event) => {
  console.log(`Player ${player} scored ${score}`);
});

// Listen for rewards
gameController.on("RewardsClaimed", (player, tokenAmount, achievementId, event) => {
  console.log(`Player ${player} received rewards`);
});
```

### Query Past Events

```javascript
const filter = gameController.filters.ScoreSubmitted();
const events = await gameController.queryFilter(filter, fromBlock, toBlock);
```

## Batch Operations

### Batch Transfer

```javascript
const recipients = [addr1, addr2, addr3];
const amounts = [
  ethers.utils.parseEther("100"),
  ethers.utils.parseEther("200"),
  ethers.utils.parseEther("300")
];

await jumpToken.batchTransfer(recipients, amounts);
```

### Batch Score Submission

```javascript
const players = [player1, player2, player3];
const scores = [150, 500, 1000];

await gameController.batchSubmitScores(players, scores);
```

## Error Handling

### Try-Catch Pattern

```javascript
try {
  const tx = await contract.function();
  await tx.wait();
} catch (error) {
  if (error.code === "ACTION_REJECTED") {
    // User rejected
  } else if (error.message.includes("AccessControl")) {
    // Permission denied
  }
}
```

### Check Before Action

```javascript
// Check if paused
const isPaused = await contract.paused();
if (isPaused) {
  throw new Error("Contract is paused");
}

// Check balance
const balance = await token.balanceOf(address);
if (balance < amount) {
  throw new Error("Insufficient balance");
}
```

## Gas Optimization

### Estimate Gas

```javascript
const gasEstimate = await contract.estimateGas.function();
console.log(`Estimated gas: ${gasEstimate.toString()}`);
```

### Set Gas Price

```javascript
const tx = await contract.function({
  gasPrice: ethers.utils.parseUnits("0.1", "gwei")
});
```

## Best Practices

1. Always check contract state before actions
2. Handle errors gracefully
3. Use events for UI updates
4. Batch operations when possible
5. Estimate gas before transactions
6. Cache contract instances
7. Validate inputs client-side

