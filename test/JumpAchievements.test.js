const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JumpAchievements", function () {
  let jumpAchievements;
  let owner;
  let addr1;
  let addr2;
  let minter;
  
  beforeEach(async function () {
    [owner, minter, addr1, addr2] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    // Grant minter role
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
  });
  
  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await jumpAchievements.name()).to.equal("Jump Achievements");
      expect(await jumpAchievements.symbol()).to.equal("JUMP-ACH");
    });
    
    it("Should grant roles to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await jumpAchievements.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
      const PAUSER_ROLE = await jumpAchievements.PAUSER_ROLE();
      
      expect(await jumpAchievements.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await jumpAchievements.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await jumpAchievements.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
    });
  });
  
  describe("Achievement Creation", function () {
    it("Should create a new achievement", async function () {
      await jumpAchievements.createAchievement(
        1,
        "First Win",
        "Win your first game",
        0,
        0,
        true
      );
      
      const achievement = await jumpAchievements.achievements(1);
      expect(achievement.name).to.equal("First Win");
      expect(achievement.exists).to.be.true;
    });
    
    it("Should revert when creating duplicate achievement", async function () {
      await jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
      
      await expect(
        jumpAchievements.createAchievement(1, "Test2", "Test2", 0, 0, true)
      ).to.be.revertedWith("JumpAchievements: achievement already exists");
    });
  });
  
  describe("Minting", function () {
    beforeEach(async function () {
      await jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
    });
    
    it("Should mint achievement to address", async function () {
      await jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x");
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(1);
    });
    
    it("Should revert when minting non-existent achievement", async function () {
      await expect(
        jumpAchievements.connect(minter).mint(addr1.address, 999, 1, "0x")
      ).to.be.revertedWith("JumpAchievements: achievement does not exist");
    });
  });
});

