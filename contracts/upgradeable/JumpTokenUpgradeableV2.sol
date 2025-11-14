// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./JumpTokenUpgradeable.sol";

/**
 * @title JumpTokenUpgradeableV2
 * @dev V2 upgrade with additional features
 */
contract JumpTokenUpgradeableV2 is JumpTokenUpgradeable {
    // New state variable
    uint256 public newFeature;
    
    // New event
    event NewFeatureUpdated(uint256 oldValue, uint256 newValue);
    
    /**
     * @dev Initialize V2 (only called once)
     */
    function initializeV2() public reinitializer(2) {
        newFeature = 0;
    }
    
    /**
     * @dev New function in V2
     */
    function setNewFeature(uint256 value) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldValue = newFeature;
        newFeature = value;
        emit NewFeatureUpdated(oldValue, value);
    }
    
    /**
     * @dev Get new feature value
     */
    function getNewFeature() external view returns (uint256) {
        return newFeature;
    }
}

