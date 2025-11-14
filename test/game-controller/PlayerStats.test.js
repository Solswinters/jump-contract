const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Player Statistics Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Initial State", function () {
    it("Should return zero stats for new player", async function () {
      const [score, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(0);
      expect(tier).to.equal(0);
      expect(rewards).to.equal(0);
    });
  });
  
  describe("Stats Updates", function () {
    it("Should update stats after score submission", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const [score, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(150);
      expect(tier).to.equal(2);
      expect(rewards).to.equal(ethers.parseEther("50"));
    });
    
    it("Should update highest score only when improved", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 200);
      
      const [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(200);
    });
    
    it("Should not update stats for lower score", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 500);
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 200);
      
      const [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(500); // Should remain at highest
    });
  });
  
  describe("Tier Progression", function () {
    it("Should track tier progression", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [, tier] = await contracts.gameController.getPlayerStats(player1.address);
      expect(tier).to.equal(1);
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      [, tier] = await contracts.gameController.getPlayerStats(player1.address);
      expect(tier).to.equal(2);
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 600);
      [, tier] = await contracts.gameController.getPlayerStats(player1.address);
      expect(tier).to.equal(3);
    });
  });
  
  describe("Total Rewards", function () {
    it("Should accumulate total rewards", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("10"));
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      [, , rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(rewards).to.equal(ethers.parseEther("50")); // Only tier 2 reward
    });
  });
});

