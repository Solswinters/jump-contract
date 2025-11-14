const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Zero Address Edge Cases", function () {
  let contracts;
  let owner, gameOperator;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
  });
  
  describe("JumpToken", function () {
    it("Should revert when minting to zero address", async function () {
      await expect(
        contracts.jumpToken.mint(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.revertedWith("JumpToken: mint to zero address");
    });
    
    it("Should revert when recovering to zero address", async function () {
      // Deploy a mock ERC20 for testing
      const MockERC20 = await ethers.getContractFactory("JumpToken");
      const mockToken = await MockERC20.deploy();
      await mockToken.waitForDeployment();
      
      await expect(
        contracts.jumpToken.recoverERC20(await mockToken.getAddress(), ethers.ZeroAddress, ethers.parseEther("1"))
      ).to.be.revertedWith("JumpToken: recover to zero address");
    });
  });
  
  describe("JumpAchievements", function () {
    beforeEach(async function () {
      await contracts.jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
    });
    
    it("Should revert when minting to zero address", async function () {
      await expect(
        contracts.jumpAchievements.connect(contracts.gameOperator).mint(ethers.ZeroAddress, 1, 1, "0x")
      ).to.be.revertedWith("JumpAchievements: mint to zero address");
    });
  });
  
  describe("JumpGameController", function () {
    it("Should revert when submitting score for zero address", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(ethers.ZeroAddress, 100)
      ).to.be.revertedWith("JumpGameController: invalid player address");
    });
    
    it("Should skip zero addresses in batch submission", async function () {
      const players = [contracts.player1.address, ethers.ZeroAddress, contracts.player2.address];
      const scores = [150, 200, 500];
      
      // Should not revert, but skip zero address
      await contracts.gameController.connect(gameOperator).batchSubmitScores(players, scores);
      
      // Player1 and player2 should have scores
      const [score1] = await contracts.gameController.getPlayerStats(contracts.player1.address);
      const [score2] = await contracts.gameController.getPlayerStats(contracts.player2.address);
      
      expect(score1).to.equal(150);
      expect(score2).to.equal(500);
    });
  });
});

