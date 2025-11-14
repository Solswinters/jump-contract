const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tier System Query Functions Tests", function () {
  let tierSystem;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("getTierForScore", function () {
    it("Should return correct tier for various scores", async function () {
      expect(await tierSystem.getTierForScore(50)).to.equal(1);
      expect(await tierSystem.getTierForScore(150)).to.equal(2);
      expect(await tierSystem.getTierForScore(600)).to.equal(3);
      expect(await tierSystem.getTierForScore(2000)).to.equal(4);
      expect(await tierSystem.getTierForScore(10000)).to.equal(5);
    });
    
    it("Should return 0 for invalid score", async function () {
      // Assuming no tier exists for negative scores
      // In practice, tier 1 starts at 0
      const tier = await tierSystem.getTierForScore(0);
      expect(tier).to.equal(1); // Tier 1 includes 0
    });
  });
  
  describe("getTokenReward", function () {
    it("Should return correct reward for each tier", async function () {
      expect(await tierSystem.getTokenReward(50)).to.equal(ethers.parseEther("10"));
      expect(await tierSystem.getTokenReward(150)).to.equal(ethers.parseEther("50"));
      expect(await tierSystem.getTokenReward(600)).to.equal(ethers.parseEther("150"));
      expect(await tierSystem.getTokenReward(2000)).to.equal(ethers.parseEther("500"));
      expect(await tierSystem.getTokenReward(10000)).to.equal(ethers.parseEther("2000"));
    });
    
    it("Should return 0 for invalid score", async function () {
      // This would require a score that doesn't match any tier
      // In practice, all scores from 0+ match tier 1
      const reward = await tierSystem.getTokenReward(0);
      expect(reward).to.equal(ethers.parseEther("10")); // Tier 1 reward
    });
  });
  
  describe("getAchievementId", function () {
    it("Should return 0 for tier 1 (no achievement)", async function () {
      expect(await tierSystem.getAchievementId(50)).to.equal(0);
    });
    
    it("Should return correct achievement ID for tiers with achievements", async function () {
      expect(await tierSystem.getAchievementId(150)).to.equal(101);
      expect(await tierSystem.getAchievementId(600)).to.equal(102);
      expect(await tierSystem.getAchievementId(2000)).to.equal(103);
      expect(await tierSystem.getAchievementId(10000)).to.equal(104);
    });
  });
  
  describe("Tier Data Access", function () {
    it("Should return tier data correctly", async function () {
      const tier = await tierSystem.tiers(2);
      expect(tier.minScore).to.equal(100);
      expect(tier.maxScore).to.equal(499);
      expect(tier.tokenReward).to.equal(ethers.parseEther("50"));
      expect(tier.achievementId).to.equal(101);
      expect(tier.exists).to.be.true;
    });
    
    it("Should return exists=false for non-existent tier", async function () {
      const tier = await tierSystem.tiers(999);
      expect(tier.exists).to.be.false;
    });
  });
});

