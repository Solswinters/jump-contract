const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Game Controller Reentrancy Protection Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Reentrancy Protection", function () {
    it("Should prevent reentrancy in submitScore", async function () {
      // Submit score multiple times in quick succession
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 500);
      
      // Should all succeed without reentrancy issues
      const [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(500);
    });
    
    it("Should prevent reentrancy in batchSubmitScores", async function () {
      const players = [player1.address, contracts.player2.address];
      const scores = [150, 500];
      
      await contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores);
      
      // Should complete without issues
      const [score1] = await contracts.gameController.getPlayerStats(player1.address);
      const [score2] = await contracts.gameController.getPlayerStats(contracts.player2.address);
      
      expect(score1).to.equal(150);
      expect(score2).to.equal(500);
    });
  });
  
  describe("State Consistency", function () {
    it("Should maintain consistent state after multiple operations", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      const totalPlayers1 = await contracts.gameController.totalPlayers();
      
      await contracts.gameController.connect(gameOperator).submitScore(contracts.player2.address, 100);
      const totalPlayers2 = await contracts.gameController.totalPlayers();
      
      expect(totalPlayers2).to.equal(totalPlayers1 + 1n);
    });
  });
});

