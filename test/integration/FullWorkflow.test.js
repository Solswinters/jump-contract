const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Full Workflow Integration Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Complete Player Journey", function () {
    it("Should handle complete player progression", async function () {
      // Start: New player
      expect(await contracts.gameController.totalPlayers()).to.equal(0);
      
      // Tier 1: First score
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [score, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(50);
      expect(tier).to.equal(1);
      expect(rewards).to.equal(ethers.parseEther("10"));
      
      let tokenBalance = await contracts.jumpToken.balanceOf(player1.address);
      expect(tokenBalance).to.equal(ethers.parseEther("10"));
      
      // Tier 2: Upgrade
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      [score, tier, rewards] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(150);
      expect(tier).to.equal(2);
      expect(rewards).to.equal(ethers.parseEther("50"));
      
      tokenBalance = await contracts.jumpToken.balanceOf(player1.address);
      expect(tokenBalance).to.equal(ethers.parseEther("50"));
      
      const badgeBalance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(badgeBalance).to.equal(1);
    });
    
    it("Should handle multiple players independently", async function () {
      const player2 = contracts.player2;
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      await contracts.gameController.connect(gameOperator).submitScore(player2.address, 500);
      
      const [score1] = await contracts.gameController.getPlayerStats(player1.address);
      const [score2] = await contracts.gameController.getPlayerStats(player2.address);
      
      expect(score1).to.equal(150);
      expect(score2).to.equal(500);
      
      const balance1 = await contracts.jumpToken.balanceOf(player1.address);
      const balance2 = await contracts.jumpToken.balanceOf(player2.address);
      
      expect(balance1).to.equal(ethers.parseEther("50"));
      expect(balance2).to.equal(ethers.parseEther("150"));
    });
  });
  
  describe("Token Operations", function () {
    it("Should allow token transfers after receiving rewards", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const player2 = contracts.player2;
      await contracts.jumpToken.connect(player1).transfer(
        player2.address,
        ethers.parseEther("25")
      );
      
      const balance1 = await contracts.jumpToken.balanceOf(player1.address);
      const balance2 = await contracts.jumpToken.balanceOf(player2.address);
      
      expect(balance1).to.equal(ethers.parseEther("25"));
      expect(balance2).to.equal(ethers.parseEther("25"));
    });
  });
});

