const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RateLimiter", function () {
  let rateLimiterContract;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy a test contract that uses RateLimiter
    const RateLimiterTest = await ethers.getContractFactory("RateLimiterTest");
    rateLimiterContract = await RateLimiterTest.deploy();
  });

  describe("Rate Limiting", function () {
    it("Should allow actions within limit", async function () {
      await rateLimiterContract.connect(user1).performAction();
      await rateLimiterContract.connect(user1).performAction();
      await rateLimiterContract.connect(user1).performAction();
      
      const remaining = await rateLimiterContract.getRemainingActions(user1.address);
      expect(remaining).to.equal(2); // 5 limit - 3 used = 2
    });

    it("Should block actions exceeding limit", async function () {
      // Perform 5 actions (at limit)
      for (let i = 0; i < 5; i++) {
        await rateLimiterContract.connect(user1).performAction();
      }
      
      // 6th action should fail
      await expect(
        rateLimiterContract.connect(user1).performAction()
      ).to.be.revertedWith("RateLimiter: rate limit exceeded");
    });

    it("Should reset limit after window expires", async function () {
      // Use all 5 actions
      for (let i = 0; i < 5; i++) {
        await rateLimiterContract.connect(user1).performAction();
      }
      
      // Fast forward time past window (60 seconds)
      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);
      
      // Should be able to perform action again
      await rateLimiterContract.connect(user1).performAction();
    });

    it("Should track actions per user independently", async function () {
      await rateLimiterContract.connect(user1).performAction();
      await rateLimiterContract.connect(user2).performAction();
      
      const remaining1 = await rateLimiterContract.getRemainingActions(user1.address);
      const remaining2 = await rateLimiterContract.getRemainingActions(user2.address);
      
      expect(remaining1).to.equal(4);
      expect(remaining2).to.equal(4);
    });
  });

  describe("Time Until Reset", function () {
    it("Should calculate time until reset correctly", async function () {
      await rateLimiterContract.connect(user1).performAction();
      
      const timeUntilReset = await rateLimiterContract.getTimeUntilReset(user1.address);
      expect(timeUntilReset).to.be.closeTo(60, 5); // 60 seconds window
    });

    it("Should return 0 if window has passed", async function () {
      await rateLimiterContract.connect(user1).performAction();
      
      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);
      
      const timeUntilReset = await rateLimiterContract.getTimeUntilReset(user1.address);
      expect(timeUntilReset).to.equal(0);
    });
  });
});

// Test contract that uses RateLimiter
contract("RateLimiterTest", function () {
  // This would be a Solidity contract for testing
  // For now, we'll need to create a mock contract
});

