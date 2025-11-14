const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tier Creation Tests", function () {
  let tierSystem;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Create New Tier", function () {
    it("Should create a new tier", async function () {
      await tierSystem.createTier(6, 10000, 20000, ethers.parseEther("5000"), 105);
      
      const tier = await tierSystem.tiers(6);
      expect(tier.exists).to.be.true;
      expect(tier.minScore).to.equal(10000);
      expect(tier.maxScore).to.equal(20000);
    });
    
    it("Should update tier count when creating higher tier", async function () {
      const initialCount = await tierSystem.tierCount();
      await tierSystem.createTier(10, 50000, 100000, ethers.parseEther("10000"), 110);
      
      const newCount = await tierSystem.tierCount();
      expect(newCount).to.equal(10);
    });
    
    it("Should revert when creating duplicate tier", async function () {
      await expect(
        tierSystem.createTier(1, 0, 100, ethers.parseEther("10"), 0)
      ).to.be.revertedWith("JumpTierSystem: tier already exists");
    });
    
    it("Should revert when minScore > maxScore", async function () {
      await expect(
        tierSystem.createTier(6, 20000, 10000, ethers.parseEther("5000"), 105)
      ).to.be.revertedWith("JumpTierSystem: invalid score range");
    });
  });
  
  describe("Update Existing Tier", function () {
    it("Should update tier configuration", async function () {
      await tierSystem.updateTier(1, 0, 99, ethers.parseEther("20"), 0);
      
      const tier = await tierSystem.tiers(1);
      expect(tier.tokenReward).to.equal(ethers.parseEther("20"));
    });
    
    it("Should revert when updating non-existent tier", async function () {
      await expect(
        tierSystem.updateTier(999, 0, 100, ethers.parseEther("10"), 0)
      ).to.be.revertedWith("JumpTierSystem: tier does not exist");
    });
  });
});

