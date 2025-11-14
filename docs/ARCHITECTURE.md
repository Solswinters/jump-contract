# Jump Token Contract Architecture

## Overview

The Jump Token system is a comprehensive blockchain-based reward mechanism for the Jump game, built on Base network. It consists of multiple interconnected smart contracts that work together to provide a secure, efficient, and scalable reward distribution system.

## System Components

### 1. JumpToken (ERC20)

The main fungible token contract that represents game currency.

**Key Features:**
- Standard ERC20 implementation
- Minting with role-based access control
- Burning functionality
- Pausable transfers
- Max supply cap (100 million tokens)
- Batch transfer operations
- Token recovery for accidentally sent tokens

**Roles:**
- `MINTER_ROLE`: Can mint new tokens
- `PAUSER_ROLE`: Can pause/unpause transfers
- `DEFAULT_ADMIN_ROLE`: Full administrative control

### 2. JumpAchievements (ERC1155)

Multi-token standard for achievement badges and collectibles.

**Key Features:**
- ERC1155 standard implementation
- Achievement metadata storage
- Category and rarity system
- Soulbound (non-transferable) achievements
- Batch minting
- URI management

**Achievement Categories:**
- Score Milestones (0)
- Streak Achievements (1)
- Special Events (2)
- Seasonal Badges (3)
- Rare Collectibles (4)

**Rarity Levels:**
- Common (0)
- Rare (1)
- Epic (2)
- Legendary (3)

### 3. JumpTierSystem

Manages score thresholds and reward calculations.

**Key Features:**
- Tier configuration with score ranges
- Token reward calculation
- Achievement ID mapping
- Dynamic tier management
- Default 5-tier system

**Default Tiers:**
- Tier 1: 0-99 points → 10 JUMP tokens
- Tier 2: 100-499 points → 50 JUMP tokens + Bronze Badge
- Tier 3: 500-999 points → 150 JUMP tokens + Silver Badge
- Tier 4: 1000-4999 points → 500 JUMP tokens + Gold Badge
- Tier 5: 5000+ points → 2000 JUMP tokens + Diamond Badge

### 4. JumpGameController

Main orchestrator contract that coordinates all reward distribution.

**Key Features:**
- Score submission and validation
- Automatic reward distribution
- Player registry
- Statistics tracking
- Batch score processing
- Reentrancy protection
- Pausable operations

**Roles:**
- `GAME_OPERATOR_ROLE`: Can submit scores
- `DEFAULT_ADMIN_ROLE`: Full administrative control

## Contract Interactions

```
┌─────────────────┐
│ GameController  │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    │         │              │
    ▼         ▼              ▼
┌────────┐ ┌──────────────┐ ┌─────────────┐
│JumpToken│ │JumpAchievements│ │TierSystem  │
└────────┘ └──────────────┘ └─────────────┘
```

### Flow Diagram

1. **Score Submission:**
   - Game operator calls `submitScore(player, score)`
   - GameController validates score
   - TierSystem calculates tier and rewards
   - Tokens minted via JumpToken
   - Achievements minted via JumpAchievements
   - Player data updated

2. **Reward Distribution:**
   - Only triggered on tier upgrade
   - Prevents duplicate rewards for same tier
   - Tracks highest score and tier

## Security Features

- **Access Control:** Role-based permissions using OpenZeppelin AccessControl
- **Reentrancy Protection:** ReentrancyGuard on critical functions
- **Pausable:** Emergency pause mechanism
- **Input Validation:** Comprehensive checks on all inputs
- **Supply Limits:** Max supply cap prevents inflation
- **Soulbound Tokens:** Non-transferable achievements prevent trading

## Gas Optimization

- Batch operations for multiple players/scores
- Efficient storage layout
- Minimal external calls
- Event-based logging instead of storage

## Upgrade Path

Currently using non-upgradeable contracts. Future versions may implement:
- Transparent proxy pattern
- UUPS proxy pattern
- Storage layout preservation

## Network Configuration

- **Primary Network:** Base (Ethereum L2)
- **Testnet:** Base Sepolia
- **Local Development:** Hardhat Network

## Deployment Order

1. JumpToken
2. JumpAchievements
3. JumpTierSystem
4. JumpGameController
5. Role configuration
6. Achievement initialization

## Future Enhancements

- Leaderboard system
- Season/period tracking
- Multi-signature governance
- Upgrade mechanism
- Cross-chain bridge support

