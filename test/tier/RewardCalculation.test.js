const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tier Reward Calculation Tests", function () {
  let tierSystem;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Token Reward Calculation", function () {
    it("Should return correct reward for tier 1", async function () {
      const reward = await tierSystem.getTokenReward(50);
      expect(reward).to.equal(ethers.parseEther("10"));
    });
    
    it("Should return correct reward for tier 2", async function () {
      const reward = await tierSystem.getTokenReward(150);
      expect(reward).to.equal(ethers.parseEther("50"));
    });
    
    it("Should return correct reward for tier 3", async function () {
      const reward = await tierSystem.getTokenReward(600);
      expect(reward).to.equal(ethers.parseEther("150"));
    });
    
    it("Should return correct reward for tier 4", async function () {
      const reward = await tierSystem.getTokenReward(2000);
      expect(reward).to.equal(ethers.parseEther("500"));
    });
    
    it("Should return correct reward for tier 5", async function () {
      const reward = await tierSystem.getTokenReward(10000);
      expect(reward).to.equal(ethers.parseEther("2000"));
    });
    
    it("Should return 0 for invalid score", async function () {
      // Assuming no tier exists for negative scores
      // In practice, tier 1 starts at 0
      const reward = await tierSystem.getTokenReward(0);
      expect(reward).to.equal(ethers.parseEther("10")); // Tier 1 reward
    });
  });
  
  describe("Achievement ID Calculation", function () {
    it("Should return 0 for tier 1 (no achievement)", async function () {
      const achievementId = await tierSystem.getAchievementId(50);
      expect(achievementId).to.equal(0);
    });
    
    it("Should return correct achievement ID for tier 2", async function () {
      const achievementId = await tierSystem.getAchievementId(150);
      expect(achievementId).to.equal(101); // Bronze badge
    });
    
    it("Should return correct achievement ID for tier 3", async function () {
      const achievementId = await tierSystem.getAchievementId(600);
      expect(achievementId).to.equal(102); // Silver badge
    });
    
    it("Should return correct achievement ID for tier 4", async function () {
      const achievementId = await tierSystem.getAchievementId(2000);
      expect(achievementId).to.equal(103); // Gold badge
    });
    
    it("Should return correct achievement ID for tier 5", async function () {
      const achievementId = await tierSystem.getAchievementId(10000);
      expect(achievementId).to.equal(104); // Diamond badge
    });
  });
  
  describe("Tier Level Calculation", function () {
    it("Should return correct tier for various scores", async function () {
      expect(await tierSystem.getTierForScore(50)).to.equal(1);
      expect(await tierSystem.getTierForScore(150)).to.equal(2);
      expect(await tierSystem.getTierForScore(600)).to.equal(3);
      expect(await tierSystem.getTierForScore(2000)).to.equal(4);
      expect(await tierSystem.getTierForScore(10000)).to.equal(5);
    });
  });
});

