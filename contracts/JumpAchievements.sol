// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title JumpAchievements
 * @dev ERC1155 token for Jump game achievement badges and collectibles
 */
contract JumpAchievements is ERC1155, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    
    string public name = "Jump Achievements";
    string public symbol = "JUMP-ACH";
    
    /**
     * @dev Achievement metadata structure
     */
    struct Achievement {
        string name;
        string description;
        uint256 category;  // 0: Score Milestone, 1: Streak, 2: Special Event, 3: Seasonal, 4: Rare
        uint256 rarity;    // 0: Common, 1: Rare, 2: Epic, 3: Legendary
        bool exists;
        bool transferable;
    }
    
    // Mapping from token ID to achievement metadata
    mapping(uint256 => Achievement) public achievements;
    
    // Achievement categories
    uint256 public constant CATEGORY_SCORE_MILESTONE = 0;
    uint256 public constant CATEGORY_STREAK = 1;
    uint256 public constant CATEGORY_SPECIAL_EVENT = 2;
    uint256 public constant CATEGORY_SEASONAL = 3;
    uint256 public constant CATEGORY_RARE = 4;
    
    // Rarity levels
    uint256 public constant RARITY_COMMON = 0;
    uint256 public constant RARITY_RARE = 1;
    uint256 public constant RARITY_EPIC = 2;
    uint256 public constant RARITY_LEGENDARY = 3;
    
    /**
     * @dev Constructor sets up the ERC1155 with base URI
     * Grants DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE to deployer
     */
    constructor(string memory baseURI) ERC1155(baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mints a single achievement to an address
     * @param to The address to receive the achievement
     * @param id The achievement token ID
     * @param amount The amount of tokens to mint
     * @param data Additional data
     * Requirements:
     * - Caller must have MINTER_ROLE
     * - Achievement must exist
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "JumpAchievements: mint to zero address");
        require(achievements[id].exists, "JumpAchievements: achievement does not exist");
        _mint(to, id, amount, data);
    }
    
    /**
     * @dev Mints multiple achievements to an address in batch
     * @param to The address to receive the achievements
     * @param ids Array of achievement token IDs
     * @param amounts Array of amounts corresponding to each ID
     * @param data Additional data
     * Requirements:
     * - Caller must have MINTER_ROLE
     * - All achievements must exist
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "JumpAchievements: mint to zero address");
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(achievements[ids[i]].exists, "JumpAchievements: achievement does not exist");
        }
        
        _mintBatch(to, ids, amounts, data);
    }
    
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

