const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Minting Authorization Tests", function () {
  let jumpAchievements;
  let owner, minter, unauthorized, addr1;
  
  beforeEach(async function () {
    [owner, minter, unauthorized, addr1] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    
    await jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
  });
  
  describe("Minter Role", function () {
    it("Should allow minter to mint", async function () {
      await expect(
        jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x")
      ).to.not.be.reverted;
    });
    
    it("Should revert when non-minter tries to mint", async function () {
      await expect(
        jumpAchievements.connect(unauthorized).mint(addr1.address, 1, 1, "0x")
      ).to.be.reverted;
    });
    
    it("Should allow admin to mint", async function () {
      await expect(
        jumpAchievements.mint(addr1.address, 1, 1, "0x")
      ).to.not.be.reverted;
    });
  });
  
  describe("Batch Minting Authorization", function () {
    beforeEach(async function () {
      await jumpAchievements.createAchievement(2, "Test2", "Test2", 0, 0, true);
    });
    
    it("Should allow minter to batch mint", async function () {
      await expect(
        jumpAchievements.connect(minter).mintBatch(
          addr1.address,
          [1, 2],
          [1, 1],
          "0x"
        )
      ).to.not.be.reverted;
    });
    
    it("Should revert when non-minter tries to batch mint", async function () {
      await expect(
        jumpAchievements.connect(unauthorized).mintBatch(
          addr1.address,
          [1, 2],
          [1, 1],
          "0x"
        )
      ).to.be.reverted;
    });
  });
});

