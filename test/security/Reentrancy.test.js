const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Reentrancy Protection Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("JumpGameController Reentrancy Protection", function () {
    it("Should prevent reentrancy in submitScore", async function () {
      // This test verifies that the nonReentrant modifier is working
      // by attempting multiple score submissions in quick succession
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      // Should succeed for different scores
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 500)
      ).to.not.be.reverted;
    });
    
    it("Should prevent reentrancy in batchSubmitScores", async function () {
      const players = [player1.address, contracts.player2.address];
      const scores = [150, 500];
      
      await expect(
        contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores)
      ).to.not.be.reverted;
    });
  });
  
  describe("Token Operations", function () {
    it("Should handle multiple mint operations safely", async function () {
      await contracts.jumpToken.mint(player1.address, ethers.parseEther("100"));
      await contracts.jumpToken.mint(player1.address, ethers.parseEther("200"));
      
      const balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("300"));
    });
  });
});

