# Contract Monitoring Guide

How to monitor Jump Token contracts for events, activity, and issues.

## Event Monitoring

### Key Events to Monitor

#### JumpToken Events
- `TokensMinted`: New tokens minted
- `TokensBurned`: Tokens burned
- `Transfer`: Token transfers
- `ContractPaused`: Contract paused
- `ContractUnpaused`: Contract unpaused

#### JumpGameController Events
- `ScoreSubmitted`: Player score submitted
- `RewardsClaimed`: Rewards distributed
- `PlayerRegistered`: New player registered

#### JumpTierSystem Events
- `TierCreated`: New tier created
- `TierUpdated`: Tier configuration updated

## Monitoring Tools

### Using ethers.js

```javascript
// Listen for events
contract.on("EventName", (arg1, arg2, event) => {
  console.log("Event:", arg1, arg2);
});

// Query past events
const filter = contract.filters.EventName();
const events = await contract.queryFilter(filter, fromBlock, toBlock);
```

### Using The Graph

Index contract events for efficient querying:
- Subgraph development
- Event indexing
- GraphQL queries

### Using Alchemy/Infura

- Webhook notifications
- Event filters
- Real-time monitoring

## Metrics to Track

### Token Metrics
- Total supply
- Circulating supply
- Burn rate
- Transfer volume

### Game Metrics
- Total players
- Score submissions
- Rewards distributed
- Tier distribution

### Contract Health
- Pause status
- Role assignments
- Gas usage
- Error rates

## Alerting

### Critical Alerts
- Contract paused
- Unauthorized access attempts
- Unusual activity patterns
- Gas price spikes

### Warning Alerts
- High minting rate
- Large transfers
- Role changes
- Tier updates

## Monitoring Setup

### 1. Event Listeners

```javascript
// Setup listeners for all contracts
jumpToken.on("TokensMinted", handleMint);
gameController.on("ScoreSubmitted", handleScore);
```

### 2. Periodic Checks

```javascript
// Check contract state periodically
setInterval(async () => {
  const isPaused = await contract.paused();
  const totalSupply = await token.totalSupply();
  // Log or alert
}, 60000); // Every minute
```

### 3. Error Tracking

```javascript
// Track transaction failures
contract.on("error", (error) => {
  logError(error);
  alertIfCritical(error);
});
```

## Best Practices

1. Monitor all critical events
2. Set up alerts for anomalies
3. Track key metrics
4. Log all important actions
5. Review logs regularly
6. Have incident response plan

## Tools

- **The Graph**: Event indexing
- **Alchemy Notify**: Webhook alerts
- **Etherscan**: Block explorer
- **Custom dashboards**: Real-time monitoring

## Resources

- [The Graph Documentation](https://thegraph.com/docs)
- [Alchemy Notify](https://docs.alchemy.com/alchemy/notify)

