const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access Control Edge Cases", function () {
  let jumpToken;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
  });
  
  describe("Role Management", function () {
    it("Should handle granting role to zero address", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      
      // OpenZeppelin AccessControl should handle this
      await expect(
        jumpToken.grantRole(MINTER_ROLE, ethers.ZeroAddress)
      ).to.be.reverted;
    });
    
    it("Should handle revoking role from address without role", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      
      // Should not revert, just do nothing
      await jumpToken.revokeRole(MINTER_ROLE, addr1.address);
      
      expect(await jumpToken.hasRole(MINTER_ROLE, addr1.address)).to.be.false;
    });
    
    it("Should handle renouncing own role", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      
      // Grant role first
      await jumpToken.grantRole(MINTER_ROLE, addr1.address);
      expect(await jumpToken.hasRole(MINTER_ROLE, addr1.address)).to.be.true;
      
      // Renounce role
      await jumpToken.connect(addr1).renounceRole(MINTER_ROLE, addr1.address);
      expect(await jumpToken.hasRole(MINTER_ROLE, addr1.address)).to.be.false;
    });
  });
  
  describe("Multiple Roles", function () {
    it("Should allow address to have multiple roles", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      const PAUSER_ROLE = await jumpToken.PAUSER_ROLE();
      
      await jumpToken.grantRole(MINTER_ROLE, addr1.address);
      await jumpToken.grantRole(PAUSER_ROLE, addr1.address);
      
      expect(await jumpToken.hasRole(MINTER_ROLE, addr1.address)).to.be.true;
      expect(await jumpToken.hasRole(PAUSER_ROLE, addr1.address)).to.be.true;
    });
  });
});

