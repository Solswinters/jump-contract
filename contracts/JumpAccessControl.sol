// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title JumpAccessControl
 * @dev Centralized access control system for Jump game contracts
 * Provides role management and multi-contract role coordination
 */
contract JumpAccessControl is AccessControl, Pausable {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant GAME_OPERATOR_ROLE = keccak256("GAME_OPERATOR_ROLE");
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    // Contract registry
    mapping(address => bool) public registeredContracts;
    mapping(bytes32 => address[]) public roleMembers;
    
    // Events
    event ContractRegistered(address indexed contractAddress, string contractName);
    event ContractUnregistered(address indexed contractAddress);
    event RoleGrantedToContract(address indexed contractAddress, bytes32 indexed role);
    event RoleRevokedFromContract(address indexed contractAddress, bytes32 indexed role);
    event EmergencyPause(address indexed pauser);
    event EmergencyUnpause(address indexed unpauser);
    
    /**
     * @dev Constructor sets up the access control system
     * Grants ADMIN_ROLE to deployer
     */
    constructor() {
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Register a contract address for role management
     * @param contractAddress The address of the contract to register
     * @param contractName Name identifier for the contract
     */
    function registerContract(address contractAddress, string memory contractName) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(contractAddress != address(0), "JumpAccessControl: zero address");
        require(!registeredContracts[contractAddress], "JumpAccessControl: already registered");
        
        registeredContracts[contractAddress] = true;
        emit ContractRegistered(contractAddress, contractName);
    }
    
    /**
     * @dev Unregister a contract address
     * @param contractAddress The address of the contract to unregister
     */
    function unregisterContract(address contractAddress) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(registeredContracts[contractAddress], "JumpAccessControl: not registered");
        
        registeredContracts[contractAddress] = false;
        emit ContractUnregistered(contractAddress);
    }
    
    /**
     * @dev Grant a role to a contract address
     * @param contractAddress The contract address to grant the role to
     * @param role The role to grant
     */
    function grantRoleToContract(address contractAddress, bytes32 role) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(registeredContracts[contractAddress], "JumpAccessControl: contract not registered");
        require(contractAddress != address(0), "JumpAccessControl: zero address");
        
        _grantRole(role, contractAddress);
        roleMembers[role].push(contractAddress);
        emit RoleGrantedToContract(contractAddress, role);
    }
    
    /**
     * @dev Revoke a role from a contract address
     * @param contractAddress The contract address to revoke the role from
     * @param role The role to revoke
     */
    function revokeRoleFromContract(address contractAddress, bytes32 role) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(registeredContracts[contractAddress], "JumpAccessControl: contract not registered");
        
        _revokeRole(role, contractAddress);
        _removeFromRoleMembers(role, contractAddress);
        emit RoleRevokedFromContract(contractAddress, role);
    }
    
    /**
     * @dev Get all members of a role
     * @param role The role to query
     * @return Array of addresses with the role
     */
    function getRoleMembers(bytes32 role) external view returns (address[] memory) {
        return roleMembers[role];
    }
    
    /**
     * @dev Check if an address has a specific role
     * @param account The address to check
     * @param role The role to check for
     * @return True if the address has the role
     */
    function hasRoleCheck(address account, bytes32 role) external view returns (bool) {
        return hasRole(role, account);
    }
    
    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyPause(msg.sender);
    }
    
    /**
     * @dev Emergency unpause function
     */
    function emergencyUnpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit EmergencyUnpause(msg.sender);
    }
    
    /**
     * @dev Batch grant roles to multiple addresses
     * @param accounts Array of addresses to grant roles to
     * @param role The role to grant
     */
    function batchGrantRole(address[] calldata accounts, bytes32 role) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0)) {
                _grantRole(role, accounts[i]);
                roleMembers[role].push(accounts[i]);
            }
        }
    }
    
    /**
     * @dev Batch revoke roles from multiple addresses
     * @param accounts Array of addresses to revoke roles from
     * @param role The role to revoke
     */
    function batchRevokeRole(address[] calldata accounts, bytes32 role) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (hasRole(role, accounts[i])) {
                _revokeRole(role, accounts[i]);
                _removeFromRoleMembers(role, accounts[i]);
            }
        }
    }
    
    /**
     * @dev Internal function to remove an address from role members array
     * @param role The role
     * @param account The address to remove
     */
    function _removeFromRoleMembers(bytes32 role, address account) internal {
        address[] storage members = roleMembers[role];
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == account) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Get role count (number of members)
     * @param role The role to query
     * @return Number of members with the role
     */
    function getRoleMemberCount(bytes32 role) external view returns (uint256) {
        return roleMembers[role].length;
    }
}

