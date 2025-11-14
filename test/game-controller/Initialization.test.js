const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Game Controller Initialization Tests", function () {
  let jumpToken, jumpAchievements, tierSystem, gameController;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Constructor Validation", function () {
    it("Should revert when token address is zero", async function () {
      const JumpGameController = await ethers.getContractFactory("JumpGameController");
      
      await expect(
        JumpGameController.deploy(
          ethers.ZeroAddress,
          await jumpAchievements.getAddress(),
          await tierSystem.getAddress()
        )
      ).to.be.revertedWith("JumpGameController: invalid token address");
    });
    
    it("Should revert when achievements address is zero", async function () {
      const JumpGameController = await ethers.getContractFactory("JumpGameController");
      
      await expect(
        JumpGameController.deploy(
          await jumpToken.getAddress(),
          ethers.ZeroAddress,
          await tierSystem.getAddress()
        )
      ).to.be.revertedWith("JumpGameController: invalid achievements address");
    });
    
    it("Should revert when tier system address is zero", async function () {
      const JumpGameController = await ethers.getContractFactory("JumpGameController");
      
      await expect(
        JumpGameController.deploy(
          await jumpToken.getAddress(),
          await jumpAchievements.getAddress(),
          ethers.ZeroAddress
        )
      ).to.be.revertedWith("JumpGameController: invalid tier system address");
    });
    
    it("Should deploy successfully with valid addresses", async function () {
      const JumpGameController = await ethers.getContractFactory("JumpGameController");
      
      const controller = await JumpGameController.deploy(
        await jumpToken.getAddress(),
        await jumpAchievements.getAddress(),
        await tierSystem.getAddress()
      );
      await controller.waitForDeployment();
      
      expect(await controller.jumpToken()).to.equal(await jumpToken.getAddress());
      expect(await controller.jumpAchievements()).to.equal(await jumpAchievements.getAddress());
      expect(await controller.tierSystem()).to.equal(await tierSystem.getAddress());
    });
  });
  
  describe("Initial State", function () {
    beforeEach(async function () {
      const JumpGameController = await ethers.getContractFactory("JumpGameController");
      gameController = await JumpGameController.deploy(
        await jumpToken.getAddress(),
        await jumpAchievements.getAddress(),
        await tierSystem.getAddress()
      );
      await gameController.waitForDeployment();
    });
    
    it("Should start with zero total players", async function () {
      expect(await gameController.totalPlayers()).to.equal(0);
    });
    
    it("Should not be paused initially", async function () {
      expect(await gameController.paused()).to.be.false;
    });
  });
});

