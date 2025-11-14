const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Pause Functionality Tests", function () {
  let jumpAchievements;
  let owner, minter, addr1;
  
  beforeEach(async function () {
    [owner, minter, addr1] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    
    await jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
  });
  
  describe("Pause Operations", function () {
    it("Should allow pauser to pause", async function () {
      await jumpAchievements.pause();
      expect(await jumpAchievements.paused()).to.be.true;
    });
    
    it("Should prevent minting when paused", async function () {
      await jumpAchievements.pause();
      
      await expect(
        jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x")
      ).to.be.reverted;
    });
    
    it("Should prevent batch minting when paused", async function () {
      await jumpAchievements.pause();
      
      await expect(
        jumpAchievements.connect(minter).mintBatch(addr1.address, [1], [1], "0x")
      ).to.be.reverted;
    });
  });
  
  describe("Unpause Operations", function () {
    it("Should allow unpause and resume operations", async function () {
      await jumpAchievements.pause();
      await jumpAchievements.unpause();
      
      expect(await jumpAchievements.paused()).to.be.false;
      
      await expect(
        jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x")
      ).to.not.be.reverted;
    });
  });
  
  describe("Access Control", function () {
    it("Should revert when non-pauser tries to pause", async function () {
      const [unauthorized] = await ethers.getSigners();
      
      await expect(
        jumpAchievements.connect(unauthorized).pause()
      ).to.be.reverted;
    });
  });
});

