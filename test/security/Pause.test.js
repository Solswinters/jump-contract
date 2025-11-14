const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Pause Functionality Security Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("JumpToken Pause", function () {
    it("Should prevent transfers when paused", async function () {
      await contracts.jumpToken.mint(player1.address, ethers.parseEther("1000"));
      
      await contracts.jumpToken.pause();
      
      await expect(
        contracts.jumpToken.connect(player1).transfer(contracts.player2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should prevent minting when paused", async function () {
      await contracts.jumpToken.pause();
      
      await expect(
        contracts.jumpToken.mint(player1.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should allow unpause and resume operations", async function () {
      await contracts.jumpToken.pause();
      await contracts.jumpToken.unpause();
      
      await expect(
        contracts.jumpToken.mint(player1.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
  });
  
  describe("JumpAchievements Pause", function () {
    beforeEach(async function () {
      await contracts.jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
    });
    
    it("Should prevent minting when paused", async function () {
      await contracts.jumpAchievements.pause();
      
      await expect(
        contracts.jumpAchievements.connect(contracts.gameOperator).mint(player1.address, 1, 1, "0x")
      ).to.be.reverted;
    });
  });
  
  describe("JumpGameController Pause", function () {
    it("Should prevent score submission when paused", async function () {
      await contracts.gameController.pause();
      
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 100)
      ).to.be.reverted;
    });
  });
});

