// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../utils/RateLimiter.sol";

/**
 * @title RateLimiterTest
 * @dev Test contract for RateLimiter library
 */
contract RateLimiterTest {
    using RateLimiter for RateLimiter.RateLimit;
    
    RateLimiter.RateLimit public rateLimit;
    uint256 public constant LIMIT = 5;
    uint256 public constant WINDOW = 60; // 60 seconds
    
    function performAction() external {
        rateLimit.checkRateLimit(rateLimit, msg.sender, LIMIT, WINDOW);
    }
    
    function getRemainingActions(address account) external view returns (uint256) {
        return rateLimit.getRemainingActions(rateLimit, account, LIMIT, WINDOW);
    }
    
    function getTimeUntilReset(address account) external view returns (uint256) {
        return rateLimit.getTimeUntilReset(rateLimit, account, WINDOW);
    }
}

