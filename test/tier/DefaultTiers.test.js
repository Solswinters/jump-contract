const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Default Tiers Initialization Tests", function () {
  let tierSystem;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Default Tier Configuration", function () {
    it("Should initialize with 5 tiers", async function () {
      expect(await tierSystem.tierCount()).to.equal(5);
    });
    
    it("Should have tier 1 configured correctly", async function () {
      const tier = await tierSystem.tiers(1);
      expect(tier.minScore).to.equal(0);
      expect(tier.maxScore).to.equal(99);
      expect(tier.tokenReward).to.equal(ethers.parseEther("10"));
      expect(tier.achievementId).to.equal(0);
      expect(tier.exists).to.be.true;
    });
    
    it("Should have tier 2 configured correctly", async function () {
      const tier = await tierSystem.tiers(2);
      expect(tier.minScore).to.equal(100);
      expect(tier.maxScore).to.equal(499);
      expect(tier.tokenReward).to.equal(ethers.parseEther("50"));
      expect(tier.achievementId).to.equal(101);
    });
    
    it("Should have tier 3 configured correctly", async function () {
      const tier = await tierSystem.tiers(3);
      expect(tier.minScore).to.equal(500);
      expect(tier.maxScore).to.equal(999);
      expect(tier.tokenReward).to.equal(ethers.parseEther("150"));
      expect(tier.achievementId).to.equal(102);
    });
    
    it("Should have tier 4 configured correctly", async function () {
      const tier = await tierSystem.tiers(4);
      expect(tier.minScore).to.equal(1000);
      expect(tier.maxScore).to.equal(4999);
      expect(tier.tokenReward).to.equal(ethers.parseEther("500"));
      expect(tier.achievementId).to.equal(103);
    });
    
    it("Should have tier 5 configured correctly", async function () {
      const tier = await tierSystem.tiers(5);
      expect(tier.minScore).to.equal(5000);
      expect(tier.tokenReward).to.equal(ethers.parseEther("2000"));
      expect(tier.achievementId).to.equal(104);
    });
  });
  
  describe("Tier Coverage", function () {
    it("Should cover all score ranges", async function () {
      expect(await tierSystem.getTierForScore(0)).to.equal(1);
      expect(await tierSystem.getTierForScore(99)).to.equal(1);
      expect(await tierSystem.getTierForScore(100)).to.equal(2);
      expect(await tierSystem.getTierForScore(499)).to.equal(2);
      expect(await tierSystem.getTierForScore(500)).to.equal(3);
      expect(await tierSystem.getTierForScore(999)).to.equal(3);
      expect(await tierSystem.getTierForScore(1000)).to.equal(4);
      expect(await tierSystem.getTierForScore(4999)).to.equal(4);
      expect(await tierSystem.getTierForScore(5000)).to.equal(5);
      expect(await tierSystem.getTierForScore(100000)).to.equal(5);
    });
  });
});

