// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title JumpTokenUpgradeable
 * @dev Upgradeable version of JumpToken using UUPS proxy pattern
 */
contract JumpTokenUpgradeable is 
    Initializable,
    ERC20Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint8 private constant DECIMALS = 18;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount);
    event ContractPaused(address indexed pauser);
    event ContractUnpaused(address indexed unpauser);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the contract
     * @param admin The admin address
     */
    function initialize(address admin) public initializer {
        __ERC20_init("Jump Token", "JUMP");
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
    }
    
    /**
     * @dev Returns the number of decimals
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
    
    /**
     * @dev Mints tokens to a specified address
     */
    function mint(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
        whenNotPaused 
    {
        require(to != address(0), "JumpTokenUpgradeable: mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "JumpTokenUpgradeable: exceeds max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, msg.sender);
    }
    
    /**
     * @dev Burns tokens from caller
     */
    function burn(uint256 amount) external whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Burns tokens from a specified address
     */
    function burnFrom(address from, uint256 amount) external whenNotPaused {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit ContractPaused(msg.sender);
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }
    
    /**
     * @dev Override _update to add pausable functionality
     */
    function _update(address from, address to, uint256 value) 
        internal 
        override 
        whenNotPaused 
    {
        super._update(from, to, value);
    }
    
    /**
     * @dev Authorize upgrade (UUPS pattern)
     */
    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyRole(UPGRADER_ROLE) 
    {}
}

