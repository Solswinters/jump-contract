const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Batch Operations Tests", function () {
  let contracts;
  let owner, gameOperator, player1, player2, player3;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
    player2 = contracts.player2;
    player3 = contracts.player3 || contracts.player2; // Fallback if player3 not defined
  });
  
  describe("Batch Token Transfers", function () {
    beforeEach(async function () {
      await contracts.jumpToken.mint(player1.address, ethers.parseEther("1000"));
    });
    
    it("Should transfer to multiple recipients", async function () {
      const recipients = [player2.address, owner.address];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];
      
      await contracts.jumpToken.connect(player1).batchTransfer(recipients, amounts);
      
      expect(await contracts.jumpToken.balanceOf(player2.address)).to.equal(ethers.parseEther("100"));
      expect(await contracts.jumpToken.balanceOf(owner.address)).to.equal(ethers.parseEther("200"));
    });
    
    it("Should handle large batch transfers", async function () {
      const recipients = [player2.address, owner.address, player3.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        ethers.parseEther("300")
      ];
      
      await contracts.jumpToken.connect(player1).batchTransfer(recipients, amounts);
      
      expect(await contracts.jumpToken.balanceOf(player2.address)).to.equal(ethers.parseEther("100"));
      expect(await contracts.jumpToken.balanceOf(owner.address)).to.equal(ethers.parseEther("200"));
    });
  });
  
  describe("Batch Achievement Minting", function () {
    beforeEach(async function () {
      await contracts.jumpAchievements.createAchievement(1, "Test1", "Test1", 0, 0, true);
      await contracts.jumpAchievements.createAchievement(2, "Test2", "Test2", 0, 1, true);
      await contracts.jumpAchievements.createAchievement(3, "Test3", "Test3", 0, 2, true);
    });
    
    it("Should mint multiple achievements in batch", async function () {
      const ids = [1, 2, 3];
      const amounts = [1, 1, 1];
      
      await contracts.jumpAchievements.connect(contracts.gameOperator).mintBatch(
        player1.address,
        ids,
        amounts,
        "0x"
      );
      
      expect(await contracts.jumpAchievements.balanceOf(player1.address, 1)).to.equal(1);
      expect(await contracts.jumpAchievements.balanceOf(player1.address, 2)).to.equal(1);
      expect(await contracts.jumpAchievements.balanceOf(player1.address, 3)).to.equal(1);
    });
  });
  
  describe("Batch Score Submission", function () {
    it("Should submit scores for multiple players", async function () {
      const players = [player1.address, player2.address, player3.address];
      const scores = [150, 500, 1000];
      
      await contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores);
      
      const [score1] = await contracts.gameController.getPlayerStats(player1.address);
      const [score2] = await contracts.gameController.getPlayerStats(player2.address);
      const [score3] = await contracts.gameController.getPlayerStats(player3.address);
      
      expect(score1).to.equal(150);
      expect(score2).to.equal(500);
      expect(score3).to.equal(1000);
    });
  });
});

