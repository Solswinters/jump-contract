const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Tier System Integration Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Tier Progression", function () {
    it("Should progress through all tiers correctly", async function () {
      // Tier 1
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(tier).to.equal(1);
      expect(rewards).to.equal(ethers.parseEther("10"));
      
      // Tier 2
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      [, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(tier).to.equal(2);
      expect(rewards).to.equal(ethers.parseEther("50"));
      
      // Tier 3
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 600);
      [, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(tier).to.equal(3);
      expect(rewards).to.equal(ethers.parseEther("150"));
    });
    
    it("Should only reward on tier upgrade", async function () {
      // Submit tier 1 score
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("10"));
      
      // Submit another tier 1 score - should not reward again
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 80);
      [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("10")); // Still tier 1 reward
    });
  });
  
  describe("Achievement Distribution", function () {
    it("Should mint achievement badge on tier upgrade", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const badgeBalance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(badgeBalance).to.equal(1);
    });
    
    it("Should not mint achievement for tier 1", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      const badgeBalance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(badgeBalance).to.equal(0); // No badge for tier 1
    });
  });
});

