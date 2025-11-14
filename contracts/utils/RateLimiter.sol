// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RateLimiter
 * @dev Provides rate limiting functionality for contract functions
 */
library RateLimiter {
    struct RateLimit {
        uint256 limit;
        uint256 window;
        mapping(address => uint256) lastAction;
        mapping(address => uint256) actionCount;
        mapping(address => uint256) windowStart;
    }
    
    /**
     * @dev Check if an action is allowed within rate limits
     * @param rateLimit The rate limit storage reference
     * @param account The account performing the action
     * @param limit Maximum actions allowed
     * @param window Time window in seconds
     */
    function checkRateLimit(
        RateLimit storage rateLimit,
        address account,
        uint256 limit,
        uint256 window
    ) internal {
        uint256 currentTime = block.timestamp;
        uint256 windowStart = rateLimit.windowStart[account];
        
        // Reset if window has passed
        if (currentTime >= windowStart + window) {
            rateLimit.actionCount[account] = 0;
            rateLimit.windowStart[account] = currentTime;
        }
        
        // Check if limit exceeded
        require(
            rateLimit.actionCount[account] < limit,
            "RateLimiter: rate limit exceeded"
        );
        
        // Increment action count
        rateLimit.actionCount[account]++;
        rateLimit.lastAction[account] = currentTime;
    }
    
    /**
     * @dev Get remaining actions for an account
     * @param rateLimit The rate limit storage reference
     * @param account The account to check
     * @param limit Maximum actions allowed
     * @param window Time window in seconds
     * @return Remaining actions allowed
     */
    function getRemainingActions(
        RateLimit storage rateLimit,
        address account,
        uint256 limit,
        uint256 window
    ) internal view returns (uint256) {
        uint256 currentTime = block.timestamp;
        uint256 windowStart = rateLimit.windowStart[account];
        
        // Reset if window has passed
        if (currentTime >= windowStart + window) {
            return limit;
        }
        
        uint256 used = rateLimit.actionCount[account];
        if (used >= limit) {
            return 0;
        }
        
        return limit - used;
    }
    
    /**
     * @dev Get time until rate limit resets
     * @param rateLimit The rate limit storage reference
     * @param account The account to check
     * @param window Time window in seconds
     * @return Seconds until reset
     */
    function getTimeUntilReset(
        RateLimit storage rateLimit,
        address account,
        uint256 window
    ) internal view returns (uint256) {
        uint256 currentTime = block.timestamp;
        uint256 windowStart = rateLimit.windowStart[account];
        uint256 resetTime = windowStart + window;
        
        if (currentTime >= resetTime) {
            return 0;
        }
        
        return resetTime - currentTime;
    }
}

