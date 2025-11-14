const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Categories and Rarity Tests", function () {
  let jumpAchievements;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
  });
  
  describe("Category Constants", function () {
    it("Should have correct category constants", async function () {
      expect(await jumpAchievements.CATEGORY_SCORE_MILESTONE()).to.equal(0);
      expect(await jumpAchievements.CATEGORY_STREAK()).to.equal(1);
      expect(await jumpAchievements.CATEGORY_SPECIAL_EVENT()).to.equal(2);
      expect(await jumpAchievements.CATEGORY_SEASONAL()).to.equal(3);
      expect(await jumpAchievements.CATEGORY_RARE()).to.equal(4);
    });
  });
  
  describe("Rarity Constants", function () {
    it("Should have correct rarity constants", async function () {
      expect(await jumpAchievements.RARITY_COMMON()).to.equal(0);
      expect(await jumpAchievements.RARITY_RARE()).to.equal(1);
      expect(await jumpAchievements.RARITY_EPIC()).to.equal(2);
      expect(await jumpAchievements.RARITY_LEGENDARY()).to.equal(3);
    });
  });
  
  describe("Achievement Creation with Categories", function () {
    it("Should create achievement with score milestone category", async function () {
      await jumpAchievements.createAchievement(1, "Milestone", "Test", 0, 0, true);
      const achievement = await jumpAchievements.achievements(1);
      expect(achievement.category).to.equal(0);
    });
    
    it("Should create achievement with streak category", async function () {
      await jumpAchievements.createAchievement(2, "Streak", "Test", 1, 0, true);
      const achievement = await jumpAchievements.achievements(2);
      expect(achievement.category).to.equal(1);
    });
    
    it("Should create achievement with special event category", async function () {
      await jumpAchievements.createAchievement(3, "Event", "Test", 2, 0, true);
      const achievement = await jumpAchievements.achievements(3);
      expect(achievement.category).to.equal(2);
    });
  });
  
  describe("Achievement Creation with Rarity", function () {
    it("Should create common achievement", async function () {
      await jumpAchievements.createAchievement(10, "Common", "Test", 0, 0, true);
      const achievement = await jumpAchievements.achievements(10);
      expect(achievement.rarity).to.equal(0);
    });
    
    it("Should create rare achievement", async function () {
      await jumpAchievements.createAchievement(11, "Rare", "Test", 0, 1, true);
      const achievement = await jumpAchievements.achievements(11);
      expect(achievement.rarity).to.equal(1);
    });
    
    it("Should create epic achievement", async function () {
      await jumpAchievements.createAchievement(12, "Epic", "Test", 0, 2, true);
      const achievement = await jumpAchievements.achievements(12);
      expect(achievement.rarity).to.equal(2);
    });
    
    it("Should create legendary achievement", async function () {
      await jumpAchievements.createAchievement(13, "Legendary", "Test", 0, 3, true);
      const achievement = await jumpAchievements.achievements(13);
      expect(achievement.rarity).to.equal(3);
    });
  });
  
  describe("Invalid Category/Rarity", function () {
    it("Should revert when creating with invalid category", async function () {
      await expect(
        jumpAchievements.createAchievement(20, "Test", "Test", 999, 0, true)
      ).to.be.revertedWith("JumpAchievements: invalid category");
    });
    
    it("Should revert when creating with invalid rarity", async function () {
      await expect(
        jumpAchievements.createAchievement(21, "Test", "Test", 0, 999, true)
      ).to.be.revertedWith("JumpAchievements: invalid rarity");
    });
  });
});

