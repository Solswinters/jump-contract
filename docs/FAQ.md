# Frequently Asked Questions

Common questions about the Jump Token contract system.

## General Questions

### What is Jump Token?

Jump Token (JUMP) is an ERC20 token that serves as the in-game currency for the Jump game. Players earn JUMP tokens by achieving certain scores in the game.

### What blockchain is this on?

The contracts are deployed on Base, an Ethereum Layer 2 network that provides low gas costs and fast transactions.

### How do players earn tokens?

Players earn tokens by achieving scores in the game. The game contract (authorized game operator) submits scores, and rewards are automatically distributed based on tier levels.

## Token Questions

### What is the total supply?

The maximum supply is 100 million JUMP tokens (100,000,000 * 10^18).

### Can tokens be burned?

Yes, tokens can be burned by the holder using the `burn()` function, or by an approved spender using `burnFrom()`.

### Are tokens transferable?

Yes, JUMP tokens are fully transferable ERC20 tokens. However, the contract can be paused by administrators in emergency situations.

## Achievement Questions

### What are achievements?

Achievements are ERC1155 tokens that represent badges and collectibles earned by players for reaching milestones.

### Can achievements be traded?

Some achievements are transferable, while others are "soulbound" (non-transferable). This is configured when the achievement is created.

### How many achievement categories are there?

There are 5 categories:
- Score Milestones
- Streak Achievements
- Special Events
- Seasonal Badges
- Rare Collectibles

## Tier System Questions

### How many tiers are there?

By default, there are 5 tiers, but administrators can create additional tiers.

### What are the tier rewards?

- Tier 1 (0-99): 10 JUMP tokens
- Tier 2 (100-499): 50 JUMP tokens + Bronze Badge
- Tier 3 (500-999): 150 JUMP tokens + Silver Badge
- Tier 4 (1000-4999): 500 JUMP tokens + Gold Badge
- Tier 5 (5000+): 2000 JUMP tokens + Diamond Badge

### Can tiers be changed?

Yes, administrators can update existing tiers or create new ones using the tier management functions.

## Technical Questions

### How do I interact with the contracts?

You can interact with the contracts using:
- Web3 libraries (ethers.js, web3.js)
- Smart contract wallets
- DApps built on top of the contracts
- Direct contract calls

### Are the contracts upgradeable?

Currently, the contracts are not upgradeable. Future versions may implement upgrade mechanisms.

### What happens if the contract is paused?

When paused, most operations are disabled:
- Token transfers
- Minting
- Score submissions

Administrative functions may still work depending on the contract.

## Development Questions

### How do I deploy the contracts?

See the [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

### How do I run tests?

```bash
npm test
```

### How do I verify contracts on Basescan?

Use the verification script:
```bash
node scripts/verify.js
```

## Security Questions

### Are the contracts audited?

The contracts use audited OpenZeppelin libraries. A full security audit is recommended before mainnet deployment.

### What security features are implemented?

- Role-based access control
- Reentrancy protection
- Pausable functionality
- Input validation
- Supply limits

### Who can mint tokens?

Only addresses with the MINTER_ROLE can mint tokens. By default, this is granted to the GameController contract.

## Support Questions

### Where can I get help?

- Check the documentation
- Review troubleshooting guide
- Open a GitHub issue
- Contact the development team

### How do I report a bug?

Open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### How do I report a security issue?

**DO NOT** open a public issue. Contact the security team directly via email.

