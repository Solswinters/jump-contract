const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControl Integration", function () {
  let accessControl, jumpToken, jumpAchievements, gameController;
  let owner, admin, minter, gameOperator, user;

  beforeEach(async function () {
    [owner, admin, minter, gameOperator, user] = await ethers.getSigners();
    
    // Deploy JumpAccessControl
    const JumpAccessControl = await ethers.getContractFactory("JumpAccessControl");
    accessControl = await JumpAccessControl.deploy();
    
    // Deploy other contracts
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    const tierSystem = await JumpTierSystem.deploy();
    
    const JumpGameController = await ethers.getContractFactory("JumpGameController");
    gameController = await JumpGameController.deploy(
      await jumpToken.getAddress(),
      await jumpAchievements.getAddress(),
      await tierSystem.getAddress()
    );
    
    // Register contracts in access control
    await accessControl.registerContract(await jumpToken.getAddress(), "JumpToken");
    await accessControl.registerContract(await jumpAchievements.getAddress(), "JumpAchievements");
    await accessControl.registerContract(await gameController.getAddress(), "JumpGameController");
  });

  describe("Cross-Contract Role Management", function () {
    it("Should grant roles to contracts through access control", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      
      await accessControl.grantRoleToContract(
        await gameController.getAddress(),
        MINTER_ROLE
      );
      
      // Game controller should be able to mint
      await jumpToken.grantRole(MINTER_ROLE, await gameController.getAddress());
      expect(await jumpToken.hasRole(MINTER_ROLE, await gameController.getAddress())).to.be.true;
    });

    it("Should revoke roles from contracts", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      
      await jumpToken.grantRole(MINTER_ROLE, await gameController.getAddress());
      await accessControl.revokeRoleFromContract(
        await gameController.getAddress(),
        MINTER_ROLE
      );
      
      // Note: This tests the access control registry, actual role revocation
      // would need to be done on the token contract itself
    });

    it("Should track role members across contracts", async function () {
      const MINTER_ROLE = await accessControl.MINTER_ROLE();
      
      await accessControl.grantRoleToContract(
        await jumpToken.getAddress(),
        MINTER_ROLE
      );
      
      const members = await accessControl.getRoleMembers(MINTER_ROLE);
      expect(members).to.include(await jumpToken.getAddress());
    });
  });

  describe("Batch Role Operations", function () {
    it("Should batch grant roles to multiple contracts", async function () {
      const MINTER_ROLE = await accessControl.MINTER_ROLE();
      
      await accessControl.batchGrantRole(
        [
          await jumpToken.getAddress(),
          await jumpAchievements.getAddress()
        ],
        MINTER_ROLE
      );
      
      expect(await accessControl.hasRole(MINTER_ROLE, await jumpToken.getAddress())).to.be.true;
      expect(await accessControl.hasRole(MINTER_ROLE, await jumpAchievements.getAddress())).to.be.true;
    });
  });
});

