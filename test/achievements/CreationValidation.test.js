const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Creation Validation Tests", function () {
  let jumpAchievements;
  let owner, unauthorized;
  
  beforeEach(async function () {
    [owner, unauthorized] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
  });
  
  describe("Access Control", function () {
    it("Should allow admin to create achievement", async function () {
      await expect(
        jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true)
      ).to.not.be.reverted;
    });
    
    it("Should revert when non-admin tries to create achievement", async function () {
      await expect(
        jumpAchievements.connect(unauthorized).createAchievement(1, "Test", "Test", 0, 0, true)
      ).to.be.reverted;
    });
  });
  
  describe("Duplicate Prevention", function () {
    it("Should revert when creating duplicate achievement ID", async function () {
      await jumpAchievements.createAchievement(1, "Test1", "Test1", 0, 0, true);
      
      await expect(
        jumpAchievements.createAchievement(1, "Test2", "Test2", 0, 0, true)
      ).to.be.revertedWith("JumpAchievements: achievement already exists");
    });
  });
  
  describe("Category Validation", function () {
    it("Should accept valid categories", async function () {
      for (let i = 0; i <= 4; i++) {
        await expect(
          jumpAchievements.createAchievement(10 + i, `Test${i}`, "Test", i, 0, true)
        ).to.not.be.reverted;
      }
    });
    
    it("Should revert when category is invalid", async function () {
      await expect(
        jumpAchievements.createAchievement(1, "Test", "Test", 999, 0, true)
      ).to.be.revertedWith("JumpAchievements: invalid category");
    });
  });
  
  describe("Rarity Validation", function () {
    it("Should accept valid rarities", async function () {
      for (let i = 0; i <= 3; i++) {
        await expect(
          jumpAchievements.createAchievement(20 + i, `Test${i}`, "Test", 0, i, true)
        ).to.not.be.reverted;
      }
    });
    
    it("Should revert when rarity is invalid", async function () {
      await expect(
        jumpAchievements.createAchievement(1, "Test", "Test", 0, 999, true)
      ).to.be.revertedWith("JumpAchievements: invalid rarity");
    });
  });
});

