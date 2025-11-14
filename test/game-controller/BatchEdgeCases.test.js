const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Batch Score Submission Edge Cases", function () {
  let contracts;
  let owner, gameOperator, player1, player2;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
    player2 = contracts.player2;
  });
  
  describe("Array Validation", function () {
    it("Should revert when arrays are empty", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).batchSubmitScores([], [])
      ).to.be.revertedWith("JumpGameController: empty arrays");
    });
    
    it("Should revert when arrays length mismatch", async function () {
      const players = [player1.address, player2.address];
      const scores = [150];
      
      await expect(
        contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores)
      ).to.be.revertedWith("JumpGameController: arrays length mismatch");
    });
    
    it("Should handle single player batch", async function () {
      const players = [player1.address];
      const scores = [150];
      
      await expect(
        contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores)
      ).to.not.be.reverted;
    });
  });
  
  describe("Zero Address Handling", function () {
    it("Should skip zero addresses in batch", async function () {
      const players = [player1.address, ethers.ZeroAddress, player2.address];
      const scores = [150, 200, 500];
      
      await contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores);
      
      // Player1 and player2 should have scores
      const [score1] = await contracts.gameController.getPlayerStats(player1.address);
      const [score2] = await contracts.gameController.getPlayerStats(player2.address);
      
      expect(score1).to.equal(150);
      expect(score2).to.equal(500);
    });
  });
  
  describe("Large Batches", function () {
    it("Should handle large batch submissions", async function () {
      const players = [];
      const scores = [];
      
      // Create 10 test players
      for (let i = 0; i < 10; i++) {
        const signer = (await ethers.getSigners())[i + 3];
        players.push(signer.address);
        scores.push(100 + i * 50);
      }
      
      await expect(
        contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores)
      ).to.not.be.reverted;
    });
  });
});

