const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Metadata Tests", function () {
  let jumpAchievements;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
  });
  
  describe("Metadata Storage", function () {
    it("Should store achievement name correctly", async function () {
      await jumpAchievements.createAchievement(1, "Test Achievement", "Description", 0, 0, true);
      const achievement = await jumpAchievements.achievements(1);
      expect(achievement.name).to.equal("Test Achievement");
    });
    
    it("Should store achievement description correctly", async function () {
      await jumpAchievements.createAchievement(2, "Test", "Long description text", 0, 0, true);
      const achievement = await jumpAchievements.achievements(2);
      expect(achievement.description).to.equal("Long description text");
    });
    
    it("Should store category correctly", async function () {
      await jumpAchievements.createAchievement(3, "Test", "Test", 2, 0, true);
      const achievement = await jumpAchievements.achievements(3);
      expect(achievement.category).to.equal(2);
    });
    
    it("Should store rarity correctly", async function () {
      await jumpAchievements.createAchievement(4, "Test", "Test", 0, 3, true);
      const achievement = await jumpAchievements.achievements(4);
      expect(achievement.rarity).to.equal(3);
    });
    
    it("Should store transferable flag correctly", async function () {
      await jumpAchievements.createAchievement(5, "Test", "Test", 0, 0, false);
      const achievement = await jumpAchievements.achievements(5);
      expect(achievement.transferable).to.be.false;
    });
  });
  
  describe("Metadata Queries", function () {
    beforeEach(async function () {
      await jumpAchievements.createAchievement(10, "Query Test", "Query Description", 1, 2, true);
    });
    
    it("Should return correct metadata for existing achievement", async function () {
      const achievement = await jumpAchievements.achievements(10);
      expect(achievement.name).to.equal("Query Test");
      expect(achievement.description).to.equal("Query Description");
      expect(achievement.category).to.equal(1);
      expect(achievement.rarity).to.equal(2);
      expect(achievement.transferable).to.be.true;
      expect(achievement.exists).to.be.true;
    });
    
    it("Should return exists=false for non-existent achievement", async function () {
      const achievement = await jumpAchievements.achievements(999);
      expect(achievement.exists).to.be.false;
    });
  });
});

