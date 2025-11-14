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
}

