# Known Issues

Known issues, limitations, and future improvements for Jump Token contracts.

## Current Limitations

### No Player Enumeration

The GameController doesn't provide a way to enumerate all players. To get a list of players, you need to:
- Track addresses from events
- Maintain a separate registry
- Use The Graph for indexing

**Workaround:** Query `PlayerRegistered` events or maintain external registry.

### No Upgrade Mechanism

Contracts are not upgradeable. To fix bugs or add features:
- Deploy new contracts
- Migrate data
- Update references

**Future:** Consider implementing proxy pattern for upgrades.

### Tier Lookup Efficiency

Tier lookup uses linear search through tiers. For many tiers, this could be optimized.

**Future:** Consider binary search or mapping for faster lookups.

## Gas Considerations

### Batch Operations

While batch operations save gas, very large batches may hit gas limits.

**Recommendation:** Limit batch sizes to reasonable numbers (e.g., 50-100 items).

### Tier Queries

Querying tier information requires iteration. For many tiers, consider caching.

## Feature Requests

### Leaderboard

Currently no built-in leaderboard functionality.

**Future:** Add leaderboard contract or use events for off-chain indexing.

### Season/Period System

No support for seasons or time-based periods.

**Future:** Add time-based tier/reset functionality.

### Multi-Signature

No multi-signature support for critical operations.

**Future:** Add multi-sig for admin functions.

## Testing Limitations

### Large-Scale Testing

Tests don't cover very large numbers of players (1000+).

**Future:** Add stress tests for scale.

### Gas Testing

Gas tests may not reflect mainnet conditions.

**Recommendation:** Test on testnet for accurate gas estimates.

## Documentation

### API Examples

Some edge cases not fully documented.

**Future:** Add more examples for edge cases.

## Security Considerations

### Rate Limiting

No built-in rate limiting for score submissions.

**Future:** Add rate limiting to prevent abuse.

### Anti-Cheat

No on-chain validation of score legitimacy.

**Note:** Score validation should be done off-chain by game server.

## Performance

### Event Queries

Querying many events can be slow.

**Recommendation:** Use indexing services like The Graph.

## Migration Notes

### Storage Layout

If upgrading contracts, ensure storage layout compatibility.

**Important:** Never change storage variable order.

## Reporting Issues

If you find issues:
1. Check if already documented
2. Open GitHub issue
3. Provide detailed description
4. Include steps to reproduce

## Future Improvements

- Upgrade mechanism
- Leaderboard system
- Season support
- Multi-signature governance
- Rate limiting
- Gas optimizations
- Enhanced testing

