const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Score Validation Tests", function () {
  let contracts;
  let owner, gameOperator, player1;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
  });
  
  describe("Valid Scores", function () {
    it("Should accept score in tier 1 range", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 50)
      ).to.not.be.reverted;
    });
    
    it("Should accept score in tier 5 range", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 10000)
      ).to.not.be.reverted;
    });
    
    it("Should accept score at tier boundaries", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 100)
      ).to.not.be.reverted;
      
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 500)
      ).to.not.be.reverted;
    });
  });
  
  describe("Score Updates", function () {
    it("Should update score when higher score submitted", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      let [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(50);
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 150);
      [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(150);
    });
    
    it("Should not update score when lower score submitted", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 500);
      let [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(500);
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 200);
      [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(500); // Should remain at highest
    });
  });
});

