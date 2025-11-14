// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./JumpToken.sol";
import "./JumpAchievements.sol";
import "./JumpTierSystem.sol";

/**
 * @title JumpGameController
 * @dev Main controller for the Jump game reward system
 * Coordinates minting of tokens and achievements based on player scores
 */
contract JumpGameController is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant GAME_OPERATOR_ROLE = keccak256("GAME_OPERATOR_ROLE");
    
    JumpToken public jumpToken;
    JumpAchievements public jumpAchievements;
    JumpTierSystem public tierSystem;
    
    /**
     * @dev Player data structure
     */
    struct PlayerData {
        uint256 highestScore;
        uint256 highestTier;
        uint256 totalRewardsClaimed;
        uint256 lastClaimTimestamp;
        bool exists;
    }
    
    // Mapping from player address to their data
    mapping(address => PlayerData) public players;
    
    // Total players registered
    uint256 public totalPlayers;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 tier);
    event RewardsClaimed(address indexed player, uint256 tokenAmount, uint256 achievementId);
    event PlayerRegistered(address indexed player);
    
    constructor(
        address _jumpToken,
        address _jumpAchievements,
        address _tierSystem
    ) {
        require(_jumpToken != address(0), "JumpGameController: invalid token address");
        require(_jumpAchievements != address(0), "JumpGameController: invalid achievements address");
        require(_tierSystem != address(0), "JumpGameController: invalid tier system address");
        
        jumpToken = JumpToken(_jumpToken);
        jumpAchievements = JumpAchievements(_jumpAchievements);
        tierSystem = JumpTierSystem(_tierSystem);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_OPERATOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Submit a player score and distribute rewards
     * @param player The player's address
     * @param score The score achieved
     * Requirements:
     * - Caller must have GAME_OPERATOR_ROLE
     * - Contract must not be paused
     */
    function submitScore(address player, uint256 score) 
        public 
        onlyRole(GAME_OPERATOR_ROLE) 
        whenNotPaused 
        nonReentrant 
    {
        require(player != address(0), "JumpGameController: invalid player address");
        
        // Register player if first time
        if (!players[player].exists) {
            _registerPlayer(player);
        }
        
        // Get tier for this score
        uint256 tier = tierSystem.getTierForScore(score);
        require(tier > 0, "JumpGameController: invalid score tier");
        
        // Update player data if this is a new high score
        if (score > players[player].highestScore) {
            players[player].highestScore = score;
            
            // Only distribute rewards if reaching a new tier
            if (tier > players[player].highestTier) {
                players[player].highestTier = tier;
                _distributeRewards(player, score);
            }
        }
        
        emit ScoreSubmitted(player, score, tier);
    }
    
    /**
     * @dev Registers a new player
     * @param player The player's address
     */
    function _registerPlayer(address player) private {
        players[player] = PlayerData({
            highestScore: 0,
            highestTier: 0,
            totalRewardsClaimed: 0,
            lastClaimTimestamp: 0,
            exists: true
        });
        
        totalPlayers++;
        emit PlayerRegistered(player);
    }
    
    /**
     * @dev Distributes rewards to a player based on their score
     * @param player The player's address
     * @param score The score achieved
     */
    function _distributeRewards(address player, uint256 score) private {
        // Get rewards from tier system
        uint256 tokenReward = tierSystem.getTokenReward(score);
        uint256 achievementId = tierSystem.getAchievementId(score);
        
        // Mint tokens
        if (tokenReward > 0) {
            jumpToken.mint(player, tokenReward);
            players[player].totalRewardsClaimed += tokenReward;
        }
        
        // Mint achievement badge
        if (achievementId > 0) {
            jumpAchievements.mint(player, achievementId, 1, "");
        }
        
        players[player].lastClaimTimestamp = block.timestamp;
        emit RewardsClaimed(player, tokenReward, achievementId);
    }
    
    /**
     * @dev Pauses the game controller
     * Requirements:
     * - Caller must have DEFAULT_ADMIN_ROLE
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses the game controller
     * Requirements:
     * - Caller must have DEFAULT_ADMIN_ROLE
     */
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Gets player statistics
     * @param player The player's address
     * @return highestScore The player's highest score
     * @return highestTier The player's highest tier reached
     * @return totalRewards Total rewards claimed
     */
    function getPlayerStats(address player) 
        public 
        view 
        returns (uint256 highestScore, uint256 highestTier, uint256 totalRewards) 
    {
        PlayerData memory data = players[player];
        return (data.highestScore, data.highestTier, data.totalRewardsClaimed);
    }
    
    /**
     * @dev Batch submit scores for multiple players
     * @param playersArray Array of player addresses
     * @param scores Array of scores corresponding to each player
     * Requirements:
     * - Caller must have GAME_OPERATOR_ROLE
     * - Arrays must have the same length
     */
    function batchSubmitScores(address[] calldata playersArray, uint256[] calldata scores)
        public
        onlyRole(GAME_OPERATOR_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(playersArray.length == scores.length, "JumpGameController: arrays length mismatch");
        require(playersArray.length > 0, "JumpGameController: empty arrays");
        
        for (uint256 i = 0; i < playersArray.length; i++) {
            if (playersArray[i] != address(0)) {
                submitScore(playersArray[i], scores[i]);
            }
        }
    }
}

