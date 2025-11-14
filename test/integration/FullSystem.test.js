const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Full System Integration", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Complete Reward Flow", function () {
    it("Should reward player for tier 1 score", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      const balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("10"));
      
      const [highestScore, highestTier] = await contracts.gameController.getPlayerStats(player1.address);
      expect(highestScore).to.equal(50);
      expect(highestTier).to.equal(1);
    });
    
    it("Should reward player for tier 2 score with badge", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const tokenBalance = await contracts.jumpToken.balanceOf(player1.address);
      expect(tokenBalance).to.equal(ethers.parseEther("50"));
      
      const badgeBalance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(badgeBalance).to.equal(1);
    });
    
    it("Should upgrade player tier and reward accordingly", async function () {
      // First tier 1
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("10"));
      
      // Upgrade to tier 2
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      balance = await contracts.jumpToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("50"));
      
      const badgeBalance = await contracts.jumpAchievements.balanceOf(player1.address, 101);
      expect(badgeBalance).to.equal(1);
    });
  });
  
  describe("Multiple Players", function () {
    it("Should handle multiple players independently", async function () {
      const player2 = contracts.player2;
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      await contracts.gameController.connect(gameOperator).submitScore(player2.address, 500);
      
      const balance1 = await contracts.jumpToken.balanceOf(player1.address);
      const balance2 = await contracts.jumpToken.balanceOf(player2.address);
      
      expect(balance1).to.equal(ethers.parseEther("50"));
      expect(balance2).to.equal(ethers.parseEther("150"));
      
      expect(await contracts.gameController.totalPlayers()).to.equal(2);
    });
  });
});

