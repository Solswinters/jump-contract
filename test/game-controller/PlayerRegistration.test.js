const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Player Registration Tests", function () {
  let contracts;
  let owner, gameOperator, player1, player2;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
    player2 = contracts.player2;
  });
  
  describe("Automatic Registration", function () {
    it("Should register player on first score submission", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      
      expect(await contracts.gameController.totalPlayers()).to.equal(1);
      
      const [score] = await contracts.gameController.getPlayerStats(player1.address);
      expect(score).to.equal(50);
    });
    
    it("Should emit PlayerRegistered event", async function () {
      await expect(
        contracts.gameController.connect(gameOperator).submitScore(player1.address, 50)
      )
        .to.emit(contracts.gameController, "PlayerRegistered")
        .withArgs(player1.address);
    });
    
    it("Should not register player twice", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 100);
      
      expect(await contracts.gameController.totalPlayers()).to.equal(1);
    });
  });
  
  describe("Multiple Players", function () {
    it("Should register multiple players independently", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      await contracts.gameController.connect(gameOperator).submitScore(player2.address, 100);
      
      expect(await contracts.gameController.totalPlayers()).to.equal(2);
    });
    
    it("Should track each player's stats independently", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      await contracts.gameController.connect(gameOperator).submitScore(player2.address, 500);
      
      const [score1] = await contracts.gameController.getPlayerStats(player1.address);
      const [score2] = await contracts.gameController.getPlayerStats(player2.address);
      
      expect(score1).to.equal(50);
      expect(score2).to.equal(500);
    });
  });
});

