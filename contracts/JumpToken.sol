// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title JumpToken
 * @dev ERC20 token with minting, burning, and pausable functionality for Jump game rewards
 */
contract JumpToken is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint8 private constant DECIMALS = 18;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount);
    event ContractPaused(address indexed pauser);
    event ContractUnpaused(address indexed pauser);
    
    /**
     * @dev Constructor sets up the token with name and symbol
     * Grants DEFAULT_ADMIN_ROLE, MINTER_ROLE, and PAUSER_ROLE to deployer
     */
    constructor() ERC20("Jump Token", "JUMP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Returns the number of decimals used for token amounts
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
    
    /**
     * @dev Mints tokens to a specified address
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     * Requirements:
     * - Caller must have MINTER_ROLE
     * - Contract must not be paused
     * - Total supply after minting must not exceed MAX_SUPPLY
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "JumpToken: mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "JumpToken: max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount, msg.sender);
    }
    
    /**
     * @dev Burns tokens from caller's account
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Burns tokens from a specified address (requires allowance)
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) public whenNotPaused {
        require(from != address(0), "JumpToken: burn from zero address");
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "JumpToken: insufficient allowance");
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    /**
     * @dev Pauses all token transfers
     * Requirements:
     * - Caller must have PAUSER_ROLE
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
        emit ContractPaused(msg.sender);
    }
    
    /**
     * @dev Unpauses all token transfers
     * Requirements:
     * - Caller must have PAUSER_ROLE
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }
    
    /**
     * @dev Batch transfer tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of token amounts corresponding to each recipient
     * Requirements:
     * - Arrays must have the same length
     * - All recipients must be valid addresses
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) public whenNotPaused {
        require(recipients.length == amounts.length, "JumpToken: arrays length mismatch");
        require(recipients.length > 0, "JumpToken: empty arrays");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "JumpToken: transfer to zero address");
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Recovers accidentally sent ERC20 tokens to this contract
     * @param token The ERC20 token address to recover
     * @param to The address to send recovered tokens to
     * @param amount The amount of tokens to recover
     * Requirements:
     * - Caller must have DEFAULT_ADMIN_ROLE
     * - Cannot recover JUMP tokens (prevents admin abuse)
     */
    function recoverERC20(address token, address to, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(this), "JumpToken: cannot recover JUMP tokens");
        require(to != address(0), "JumpToken: recover to zero address");
        IERC20(token).transfer(to, amount);
    }
    
    /**
     * @dev Override _update to add pausable functionality to transfers
     */
    function _update(address from, address to, uint256 value) internal virtual override whenNotPaused {
        super._update(from, to, value);
    }
}

