// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title JumpTierSystem
 * @dev Manages score tiers and reward calculations for the Jump game
 */
contract JumpTierSystem is AccessControl {
    /**
     * @dev Tier structure defining score thresholds and rewards
     */
    struct Tier {
        uint256 minScore;
        uint256 maxScore;
        uint256 tokenReward;
        uint256 achievementId;
        bool exists;
    }
    
    // Mapping from tier level to tier data
    mapping(uint256 => Tier) public tiers;
    
    // Total number of tiers
    uint256 public tierCount;
    
    // Events
    event TierCreated(uint256 indexed tierLevel, uint256 minScore, uint256 maxScore, uint256 tokenReward);
    event TierUpdated(uint256 indexed tierLevel, uint256 minScore, uint256 maxScore, uint256 tokenReward);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _initializeDefaultTiers();
    }
    
    /**
     * @dev Initializes the default tier structure
     */
    function _initializeDefaultTiers() private {
        // Tier 1: 0-99 points → 10 JUMP tokens
        tiers[1] = Tier({
            minScore: 0,
            maxScore: 99,
            tokenReward: 10 * 10**18,
            achievementId: 0,
            exists: true
        });
        
        // Tier 2: 100-499 points → 50 JUMP tokens + Bronze Badge (ID: 101)
        tiers[2] = Tier({
            minScore: 100,
            maxScore: 499,
            tokenReward: 50 * 10**18,
            achievementId: 101,
            exists: true
        });
        
        // Tier 3: 500-999 points → 150 JUMP tokens + Silver Badge (ID: 102)
        tiers[3] = Tier({
            minScore: 500,
            maxScore: 999,
            tokenReward: 150 * 10**18,
            achievementId: 102,
            exists: true
        });
        
        // Tier 4: 1000-4999 points → 500 JUMP tokens + Gold Badge (ID: 103)
        tiers[4] = Tier({
            minScore: 1000,
            maxScore: 4999,
            tokenReward: 500 * 10**18,
            achievementId: 103,
            exists: true
        });
        
        // Tier 5: 5000+ points → 2000 JUMP tokens + Diamond Badge (ID: 104)
        tiers[5] = Tier({
            minScore: 5000,
            maxScore: type(uint256).max,
            tokenReward: 2000 * 10**18,
            achievementId: 104,
            exists: true
        });
        
        tierCount = 5;
    }
    
    /**
     * @dev Gets the tier level for a given score
     * @param score The player's score
     * @return tierLevel The tier level (0 if no tier found)
     */
    function getTierForScore(uint256 score) public view returns (uint256 tierLevel) {
        for (uint256 i = 1; i <= tierCount; i++) {
            if (tiers[i].exists && score >= tiers[i].minScore && score <= tiers[i].maxScore) {
                return i;
            }
        }
        return 0; // No tier found
    }
    
    /**
     * @dev Gets the token reward for a given score
     * @param score The player's score
     * @return tokenReward The amount of tokens to reward
     */
    function getTokenReward(uint256 score) public view returns (uint256 tokenReward) {
        uint256 tier = getTierForScore(score);
        if (tier > 0 && tiers[tier].exists) {
            return tiers[tier].tokenReward;
        }
        return 0;
    }
    
    /**
     * @dev Gets the achievement ID for a given score
     * @param score The player's score
     * @return achievementId The achievement ID to award (0 if none)
     */
    function getAchievementId(uint256 score) public view returns (uint256 achievementId) {
        uint256 tier = getTierForScore(score);
        if (tier > 0 && tiers[tier].exists) {
            return tiers[tier].achievementId;
        }
        return 0;
    }
}

