const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JumpTierSystem", function () {
  let tierSystem;
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should initialize with 5 default tiers", async function () {
      expect(await tierSystem.tierCount()).to.equal(5);
    });
    
    it("Should have correct tier 1 configuration", async function () {
      const tier1 = await tierSystem.tiers(1);
      expect(tier1.minScore).to.equal(0);
      expect(tier1.maxScore).to.equal(99);
      expect(tier1.tokenReward).to.equal(ethers.parseEther("10"));
      expect(tier1.exists).to.be.true;
    });
    
    it("Should have correct tier 5 configuration", async function () {
      const tier5 = await tierSystem.tiers(5);
      expect(tier5.minScore).to.equal(5000);
      expect(tier5.tokenReward).to.equal(ethers.parseEther("2000"));
      expect(tier5.achievementId).to.equal(104);
    });
  });
  
  describe("Tier Validation", function () {
    it("Should return correct tier for score 50", async function () {
      expect(await tierSystem.getTierForScore(50)).to.equal(1);
    });
    
    it("Should return correct tier for score 150", async function () {
      expect(await tierSystem.getTierForScore(150)).to.equal(2);
    });
    
    it("Should return correct tier for score 5000", async function () {
      expect(await tierSystem.getTierForScore(5000)).to.equal(5);
    });
    
    it("Should return correct token reward for score", async function () {
      expect(await tierSystem.getTokenReward(150)).to.equal(ethers.parseEther("50"));
    });
    
    it("Should return correct achievement ID for score", async function () {
      expect(await tierSystem.getAchievementId(600)).to.equal(102);
    });
  });
  
  describe("Tier Management", function () {
    it("Should allow admin to update tier", async function () {
      await tierSystem.updateTier(1, 0, 99, ethers.parseEther("20"), 0);
      const tier1 = await tierSystem.tiers(1);
      expect(tier1.tokenReward).to.equal(ethers.parseEther("20"));
    });
    
    it("Should allow admin to create new tier", async function () {
      await tierSystem.createTier(6, 10000, ethers.MaxUint256, ethers.parseEther("5000"), 105);
      expect(await tierSystem.tierCount()).to.equal(6);
    });
    
    it("Should revert when non-admin tries to update tier", async function () {
      await expect(
        tierSystem.connect(addr1).updateTier(1, 0, 99, ethers.parseEther("20"), 0)
      ).to.be.reverted;
    });
  });
});

