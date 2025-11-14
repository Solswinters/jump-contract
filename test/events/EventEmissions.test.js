const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Event Emissions Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("JumpToken Events", function () {
    it("Should emit TokensMinted event", async function () {
      await expect(contracts.jumpToken.mint(player1.address, ethers.parseEther("100")))
        .to.emit(contracts.jumpToken, "TokensMinted")
        .withArgs(player1.address, ethers.parseEther("100"), owner.address);
    });
    
    it("Should emit TokensBurned event", async function () {
      await contracts.jumpToken.mint(player1.address, ethers.parseEther("100"));
      
      await expect(contracts.jumpToken.connect(player1).burn(ethers.parseEther("50")))
        .to.emit(contracts.jumpToken, "TokensBurned")
        .withArgs(player1.address, ethers.parseEther("50"));
    });
    
    it("Should emit ContractPaused event", async function () {
      await expect(contracts.jumpToken.pause())
        .to.emit(contracts.jumpToken, "ContractPaused")
        .withArgs(owner.address);
    });
  });
  
  describe("JumpGameController Events", function () {
    it("Should emit ScoreSubmitted event", async function () {
      await expect(contracts.gameController.connect(gameOperator).submitScore(player1.address, 150))
        .to.emit(contracts.gameController, "ScoreSubmitted")
        .withArgs(player1.address, 150, 2);
    });
    
    it("Should emit PlayerRegistered event on first score", async function () {
      await expect(contracts.gameController.connect(gameOperator).submitScore(player1.address, 50))
        .to.emit(contracts.gameController, "PlayerRegistered")
        .withArgs(player1.address);
    });
    
    it("Should emit RewardsClaimed event", async function () {
      await expect(contracts.gameController.connect(gameOperator).submitScore(player1.address, 150))
        .to.emit(contracts.gameController, "RewardsClaimed")
        .withArgs(player1.address, ethers.parseEther("50"), 101);
    });
  });
  
  describe("JumpTierSystem Events", function () {
    it("Should emit TierCreated event", async function () {
      await expect(contracts.tierSystem.createTier(6, 10000, 20000, ethers.parseEther("5000"), 105))
        .to.emit(contracts.tierSystem, "TierCreated")
        .withArgs(6, 10000, 20000, ethers.parseEther("5000"));
    });
    
    it("Should emit TierUpdated event", async function () {
      await expect(contracts.tierSystem.updateTier(1, 0, 99, ethers.parseEther("20"), 0))
        .to.emit(contracts.tierSystem, "TierUpdated")
        .withArgs(1, 0, 99, ethers.parseEther("20"));
    });
  });
});

