const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Game Controller Events Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Score Submission Events", function () {
    it("Should emit ScoreSubmitted event", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 150)
      )
        .to.emit(contracts.gameController, "ScoreSubmitted")
        .withArgs(player1.address, 150, 2);
    });
  });
  
  describe("Player Registration Events", function () {
    it("Should emit PlayerRegistered on first score", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 50)
      )
        .to.emit(contracts.gameController, "PlayerRegistered")
        .withArgs(player1.address);
    });
    
    it("Should not emit PlayerRegistered on subsequent scores", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 100)
      ).to.not.emit(contracts.gameController, "PlayerRegistered");
    });
  });
  
  describe("Reward Claim Events", function () {
    it("Should emit RewardsClaimed on tier upgrade", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 150)
      )
        .to.emit(contracts.gameController, "RewardsClaimed")
        .withArgs(player1.address, ethers.parseEther("50"), 101);
    });
    
    it("Should not emit RewardsClaimed for same tier", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 80)
      ).to.not.emit(contracts.gameController, "RewardsClaimed");
    });
  });
});

