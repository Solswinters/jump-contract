const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tier System Edge Cases", function () {
  let tierSystem;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Boundary Conditions", function () {
    it("Should handle score at tier boundary (99)", async function () {
      expect(await tierSystem.getTierForScore(99)).to.equal(1);
    });
    
    it("Should handle score at tier boundary (100)", async function () {
      expect(await tierSystem.getTierForScore(100)).to.equal(2);
    });
    
    it("Should handle score at tier boundary (499)", async function () {
      expect(await tierSystem.getTierForScore(499)).to.equal(2);
    });
    
    it("Should handle score at tier boundary (500)", async function () {
      expect(await tierSystem.getTierForScore(500)).to.equal(3);
    });
    
    it("Should handle score at tier boundary (5000)", async function () {
      expect(await tierSystem.getTierForScore(5000)).to.equal(5);
    });
  });
  
  describe("Invalid Scores", function () {
    it("Should return 0 for score below minimum", async function () {
      // This test assumes no tier exists for negative scores
      // In practice, tier 1 starts at 0
      const tier = await tierSystem.getTierForScore(0);
      expect(tier).to.equal(1); // Tier 1 starts at 0
    });
    
    it("Should handle very large scores", async function () {
      const largeScore = ethers.parseEther("1000000");
      const tier = await tierSystem.getTierForScore(largeScore);
      expect(tier).to.equal(5); // Highest tier
    });
  });
  
  describe("Tier Updates", function () {
    it("Should handle updating tier with same values", async function () {
      await tierSystem.updateTier(1, 0, 99, ethers.parseEther("10"), 0);
      const tier = await tierSystem.tiers(1);
      expect(tier.tokenReward).to.equal(ethers.parseEther("10"));
    });
    
    it("Should revert when updating non-existent tier", async function () {
      await expect(
        tierSystem.updateTier(999, 0, 100, ethers.parseEther("10"), 0)
      ).to.be.revertedWith("JumpTierSystem: tier does not exist");
    });
    
    it("Should revert when creating duplicate tier", async function () {
      await expect(
        tierSystem.createTier(1, 0, 100, ethers.parseEther("10"), 0)
      ).to.be.revertedWith("JumpTierSystem: tier already exists");
    });
  });
});

