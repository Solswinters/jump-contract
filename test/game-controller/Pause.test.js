const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Game Controller Pause Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Pause Functionality", function () {
    it("Should allow admin to pause", async function () {
      await contracts.gameController.pause();
      expect(await contracts.gameController.paused()).to.be.true;
    });
    
    it("Should prevent score submission when paused", async function () {
      await contracts.gameController.pause();
      
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 100)
      ).to.be.reverted;
    });
    
    it("Should prevent batch score submission when paused", async function () {
      await contracts.gameController.pause();
      
      await expect(
        contracts.gameController.connect(gameOperator).batchSubmitScores(
          [player1.address],
          [100]
        )
      ).to.be.reverted;
    });
  });
  
  describe("Unpause Functionality", function () {
    it("Should allow admin to unpause", async function () {
      await contracts.gameController.pause();
      await contracts.gameController.unpause();
      
      expect(await contracts.gameController.paused()).to.be.false;
    });
    
    it("Should allow score submission after unpause", async function () {
      await contracts.gameController.pause();
      await contracts.gameController.unpause();
      
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 100)
      ).to.not.be.reverted;
    });
  });
  
  describe("Access Control", function () {
    it("Should revert when non-admin tries to pause", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).pause()
      ).to.be.reverted;
    });
  });
});

