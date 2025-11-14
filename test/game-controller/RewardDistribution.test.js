const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Reward Distribution Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Token Rewards", function () {
    it("Should mint tokens on tier 1 score", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      const balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("10"));
    });
    
    it("Should mint tokens on tier 2 score", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("50"));
    });
    
    it("Should mint tokens on tier 5 score", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 10000);
      
      const balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("2000"));
    });
  });
  
  describe("Achievement Rewards", function () {
    it("Should not mint achievement for tier 1", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      const balance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(balance).to.equal(0);
    });
    
    it("Should mint achievement for tier 2", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const balance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(balance).to.equal(1);
    });
    
    it("Should mint correct achievement for tier 5", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 10000);
      
      const balance = await contracts.jumpAchievements.balanceOf(player1.address, 104);
      expect(balance).to.equal(1);
    });
  });
  
  describe("Reward Accumulation", function () {
    it("Should only reward on tier upgrade", async function () {
      // Tier 1
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("10"));
      
      // Same tier - no new reward
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 80);
      [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("10"));
      
      // Tier upgrade - new reward
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("50"));
    });
  });
});

