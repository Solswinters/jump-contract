const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Total Players Tracking Tests", function () {
  let contracts;
  let owner, gameOperator, player1, player2, player3;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
    gameOperator = contracts.gameOperator;
    player1 = contracts.player1;
    player2 = contracts.player2;
    player3 = contracts.player3 || contracts.player2;
  });
  
  describe("Player Count", function () {
    it("Should start with zero players", async function () {
      expect(await contracts.gameController.totalPlayers()).to.equal(0);
    });
    
    it("Should increment on first player registration", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      expect(await contracts.gameController.totalPlayers()).to.equal(1);
    });
    
    it("Should increment for each new player", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      expect(await contracts.gameController.totalPlayers()).to.equal(1);
      
      await contracts.gameController.connect(gameOperator).submitScore(player2.address, 100);
      expect(await contracts.gameController.totalPlayers()).to.equal(2);
      
      await contracts.gameController.connect(gameOperator).submitScore(player3.address, 200);
      expect(await contracts.gameController.totalPlayers()).to.equal(3);
    });
    
    it("Should not increment for existing player", async function () {
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 50);
      expect(await contracts.gameController.totalPlayers()).to.equal(1);
      
      await contracts.gameController.connect(gameOperator).submitScore(player1.address, 100);
      expect(await contracts.gameController.totalPlayers()).to.equal(1); // Still 1
    });
  });
});

