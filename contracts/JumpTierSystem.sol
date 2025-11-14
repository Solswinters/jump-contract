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
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}

