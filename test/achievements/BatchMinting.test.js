const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Batch Achievement Minting Tests", function () {
  let jumpAchievements;
  let owner, minter, addr1;
  
  beforeEach(async function () {
    [owner, minter, addr1] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    
    // Create multiple achievements
    await jumpAchievements.createAchievement(1, "Test1", "Test1", 0, 0, true);
    await jumpAchievements.createAchievement(2, "Test2", "Test2", 0, 1, true);
    await jumpAchievements.createAchievement(3, "Test3", "Test3", 0, 2, true);
  });
  
  describe("Batch Minting", function () {
    it("Should mint multiple achievements in batch", async function () {
      const ids = [1, 2, 3];
      const amounts = [1, 2, 3];
      
      await jumpAchievements.connect(minter).mintBatch(addr1.address, ids, amounts, "0x");
      
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(1);
      expect(await jumpAchievements.balanceOf(addr1.address, 2)).to.equal(2);
      expect(await jumpAchievements.balanceOf(addr1.address, 3)).to.equal(3);
    });
    
    it("Should revert when minting non-existent achievement in batch", async function () {
      const ids = [1, 999, 3];
      const amounts = [1, 1, 1];
      
      await expect(
        jumpAchievements.connect(minter).mintBatch(addr1.address, ids, amounts, "0x")
      ).to.be.revertedWith("JumpAchievements: achievement does not exist");
    });
    
    it("Should revert when arrays length mismatch", async function () {
      const ids = [1, 2, 3];
      const amounts = [1, 2];
      
      await expect(
        jumpAchievements.connect(minter).mintBatch(addr1.address, ids, amounts, "0x")
      ).to.be.reverted;
    });
  });
});

