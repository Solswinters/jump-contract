const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JumpGameController", function () {
  let jumpToken;
  let jumpAchievements;
  let tierSystem;
  let gameController;
  let owner;
  let gameOperator;
  let player1;
  let player2;
  
  beforeEach(async function () {
    [owner, gameOperator, player1, player2] = await ethers.getSigners();
    
    // Deploy JumpToken
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    // Deploy JumpAchievements
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    // Deploy JumpTierSystem
    const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
    tierSystem = await JumpTierSystem.deploy();
    await tierSystem.waitForDeployment();
    
    // Deploy JumpGameController
    const JumpGameController = await ethers.getContractFactory("JumpGameController");
    gameController = await JumpGameController.deploy(
      await jumpToken.getAddress(),
      await jumpAchievements.getAddress(),
      await tierSystem.getAddress()
    );
    await gameController.waitForDeployment();
    
    // Setup roles
    const MINTER_ROLE = await jumpToken.MINTER_ROLE();
    await jumpToken.grantRole(MINTER_ROLE, await gameController.getAddress());
    
    const MINTER_ROLE_ACH = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE_ACH, await gameController.getAddress());
    
    // Create achievement badges
    await jumpAchievements.createAchievement(101, "Bronze", "Bronze badge", 0, 0, false);
    await jumpAchievements.createAchievement(102, "Silver", "Silver badge", 0, 1, false);
    await jumpAchievements.createAchievement(103, "Gold", "Gold badge", 0, 2, false);
    await jumpAchievements.createAchievement(104, "Diamond", "Diamond badge", 0, 3, false);
    
    // Grant game operator role
    const GAME_OPERATOR_ROLE = await gameController.GAME_OPERATOR_ROLE();
    await gameController.grantRole(GAME_OPERATOR_ROLE, gameOperator.address);
  });
  
  describe("Deployment", function () {
    it("Should set the correct contract addresses", async function () {
      expect(await gameController.jumpToken()).to.equal(await jumpToken.getAddress());
      expect(await gameController.jumpAchievements()).to.equal(await jumpAchievements.getAddress());
      expect(await gameController.tierSystem()).to.equal(await tierSystem.getAddress());
    });
    
    it("Should grant roles to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await gameController.DEFAULT_ADMIN_ROLE();
      const GAME_OPERATOR_ROLE = await gameController.GAME_OPERATOR_ROLE();
      
      expect(await gameController.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await gameController.hasRole(GAME_OPERATOR_ROLE, owner.address)).to.be.true;
    });
  });
  
  describe("Score Submission", function () {
    it("Should register new player on first score submission", async function () {
      await gameController.connect(gameOperator).submitScore(player1.address, 150);
      
      const [highestScore, highestTier, totalRewards] = await gameController.getPlayerStats(player1.address);
      expect(highestScore).to.equal(150);
      expect(await gameController.totalPlayers()).to.equal(1);
    });
    
    it("Should emit ScoreSubmitted event", async function () {
      await expect(gameController.connect(gameOperator).submitScore(player1.address, 150))
        .to.emit(gameController, "ScoreSubmitted")
        .withArgs(player1.address, 150, 2);
    });
    
    it("Should revert when non-operator submits score", async function () {
      await expect(
        gameController.connect(player1).submitScore(player2.address, 100)
      ).to.be.reverted;
    });
  });
  
  describe("Batch Score Submission", function () {
    it("Should submit scores for multiple players", async function () {
      const players = [player1.address, player2.address];
      const scores = [150, 500];
      
      await gameController.connect(gameOperator).batchSubmitScores(players, scores);
      
      const [score1, tier1] = await gameController.getPlayerStats(player1.address);
      const [score2, tier2] = await gameController.getPlayerStats(player2.address);
      
      expect(score1).to.equal(150);
      expect(score2).to.equal(500);
      expect(tier1).to.equal(2);
      expect(tier2).to.equal(3);
    });
    
    it("Should revert when arrays length mismatch", async function () {
      const players = [player1.address, player2.address];
      const scores = [150];
      
      await expect(
        gameController.connect(gameOperator).batchSubmitScores(players, scores)
      ).to.be.revertedWith("JumpGameController: arrays length mismatch");
    });
  });
});

