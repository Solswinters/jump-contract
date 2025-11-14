const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tier System Admin Functions Tests", function () {
  let tierSystem;
  let owner, unauthorized;
  
  beforeEach(async function () {
    [owner, unauthorized] = await ethers.getSigners();
    
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
  });
  
  describe("Access Control", function () {
    it("Should allow admin to create tier", async function () {
      await expect(
        tierSystem.createTier(6, 10000, 20000, ethers.parseEther("5000"), 105)
      ).to.not.be.reverted;
    });
    
    it("Should revert when non-admin tries to create tier", async function () {
      await expect(
        tierSystem.connect(unauthorized).createTier(6, 10000, 20000, ethers.parseEther("5000"), 105)
      ).to.be.reverted;
    });
    
    it("Should allow admin to update tier", async function () {
      await expect(
        tierSystem.updateTier(1, 0, 99, ethers.parseEther("20"), 0)
      ).to.not.be.reverted;
    });
    
    it("Should revert when non-admin tries to update tier", async function () {
      await expect(
        tierSystem.connect(unauthorized).updateTier(1, 0, 99, ethers.parseEther("20"), 0)
      ).to.be.reverted;
    });
  });
  
  describe("Tier Management", function () {
    it("Should create and update tiers correctly", async function () {
      // Create new tier
      await tierSystem.createTier(6, 10000, 20000, ethers.parseEther("5000"), 105);
      let tier = await tierSystem.tiers(6);
      expect(tier.tokenReward).to.equal(ethers.parseEther("5000"));
      
      // Update tier
      await tierSystem.updateTier(6, 10000, 25000, ethers.parseEther("6000"), 105);
      tier = await tierSystem.tiers(6);
      expect(tier.tokenReward).to.equal(ethers.parseEther("6000"));
      expect(tier.maxScore).to.equal(25000);
    });
  });
});

