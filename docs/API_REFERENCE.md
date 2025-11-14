# API Reference

Complete API reference for all Jump Token contracts.

## JumpToken

### Functions

#### `mint(address to, uint256 amount)`
Mints tokens to a specified address.

**Parameters:**
- `to`: Recipient address
- `amount`: Amount of tokens to mint

**Requirements:**
- Caller must have MINTER_ROLE
- Contract must not be paused
- Total supply must not exceed MAX_SUPPLY

**Events:**
- `TokensMinted(address indexed to, uint256 amount, address indexed minter)`

#### `burn(uint256 amount)`
Burns tokens from caller's account.

**Parameters:**
- `amount`: Amount of tokens to burn

**Events:**
- `TokensBurned(address indexed from, uint256 amount)`

#### `burnFrom(address from, uint256 amount)`
Burns tokens from a specified address (requires allowance).

**Parameters:**
- `from`: Address to burn from
- `amount`: Amount to burn

#### `pause()`
Pauses all token transfers.

**Requirements:**
- Caller must have PAUSER_ROLE

**Events:**
- `ContractPaused(address indexed pauser)`

#### `unpause()`
Unpauses all token transfers.

**Requirements:**
- Caller must have PAUSER_ROLE

**Events:**
- `ContractUnpaused(address indexed pauser)`

#### `batchTransfer(address[] recipients, uint256[] amounts)`
Transfers tokens to multiple addresses in a single transaction.

**Parameters:**
- `recipients`: Array of recipient addresses
- `amounts`: Array of token amounts

### Constants

- `MAX_SUPPLY`: 100,000,000 * 10^18
- `MINTER_ROLE`: Role hash for minters
- `PAUSER_ROLE`: Role hash for pausers

## JumpAchievements

### Functions

#### `createAchievement(uint256 id, string name, string description, uint256 category, uint256 rarity, bool transferable)`
Creates a new achievement type.

**Parameters:**
- `id`: Achievement token ID
- `name`: Achievement name
- `description`: Achievement description
- `category`: Category (0-4)
- `rarity`: Rarity level (0-3)
- `transferable`: Whether achievement can be transferred

**Requirements:**
- Caller must have DEFAULT_ADMIN_ROLE
- Achievement ID must not already exist

#### `mint(address to, uint256 id, uint256 amount, bytes data)`
Mints a single achievement.

**Parameters:**
- `to`: Recipient address
- `id`: Achievement token ID
- `amount`: Amount to mint
- `data`: Additional data

**Requirements:**
- Caller must have MINTER_ROLE
- Achievement must exist

#### `mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data)`
Mints multiple achievements in batch.

**Parameters:**
- `to`: Recipient address
- `ids`: Array of achievement IDs
- `amounts`: Array of amounts
- `data`: Additional data

### Constants

- `CATEGORY_SCORE_MILESTONE`: 0
- `CATEGORY_STREAK`: 1
- `CATEGORY_SPECIAL_EVENT`: 2
- `CATEGORY_SEASONAL`: 3
- `CATEGORY_RARE`: 4
- `RARITY_COMMON`: 0
- `RARITY_RARE`: 1
- `RARITY_EPIC`: 2
- `RARITY_LEGENDARY`: 3

## JumpTierSystem

### Functions

#### `getTierForScore(uint256 score) → uint256`
Returns the tier level for a given score.

**Parameters:**
- `score`: Player's score

**Returns:**
- Tier level (0 if no tier found)

#### `getTokenReward(uint256 score) → uint256`
Returns the token reward for a given score.

**Parameters:**
- `score`: Player's score

**Returns:**
- Token reward amount

#### `getAchievementId(uint256 score) → uint256`
Returns the achievement ID for a given score.

**Parameters:**
- `score`: Player's score

**Returns:**
- Achievement ID (0 if none)

#### `updateTier(uint256 tierLevel, uint256 minScore, uint256 maxScore, uint256 tokenReward, uint256 achievementId)`
Updates an existing tier.

**Requirements:**
- Caller must have DEFAULT_ADMIN_ROLE
- Tier must exist

**Events:**
- `TierUpdated(uint256 indexed tierLevel, uint256 minScore, uint256 maxScore, uint256 tokenReward)`

#### `createTier(uint256 tierLevel, uint256 minScore, uint256 maxScore, uint256 tokenReward, uint256 achievementId)`
Creates a new tier.

**Requirements:**
- Caller must have DEFAULT_ADMIN_ROLE
- Tier must not already exist

**Events:**
- `TierCreated(uint256 indexed tierLevel, uint256 minScore, uint256 maxScore, uint256 tokenReward)`

## JumpGameController

### Functions

#### `submitScore(address player, uint256 score)`
Submits a player score and distributes rewards.

**Parameters:**
- `player`: Player's address
- `score`: Score achieved

**Requirements:**
- Caller must have GAME_OPERATOR_ROLE
- Contract must not be paused

**Events:**
- `ScoreSubmitted(address indexed player, uint256 score, uint256 tier)`
- `RewardsClaimed(address indexed player, uint256 tokenAmount, uint256 achievementId)`
- `PlayerRegistered(address indexed player)` (if first time)

#### `batchSubmitScores(address[] playersArray, uint256[] scores)`
Batch submit scores for multiple players.

**Parameters:**
- `playersArray`: Array of player addresses
- `scores`: Array of scores

**Requirements:**
- Caller must have GAME_OPERATOR_ROLE
- Arrays must have same length

#### `getPlayerStats(address player) → (uint256 highestScore, uint256 highestTier, uint256 totalRewards)`
Gets player statistics.

**Parameters:**
- `player`: Player's address

**Returns:**
- `highestScore`: Highest score achieved
- `highestTier`: Highest tier reached
- `totalRewards`: Total rewards claimed

#### `pause()`
Pauses the game controller.

**Requirements:**
- Caller must have DEFAULT_ADMIN_ROLE

#### `unpause()`
Unpauses the game controller.

**Requirements:**
- Caller must have DEFAULT_ADMIN_ROLE

### State Variables

- `jumpToken`: JumpToken contract address
- `jumpAchievements`: JumpAchievements contract address
- `tierSystem`: JumpTierSystem contract address
- `totalPlayers`: Total number of registered players

