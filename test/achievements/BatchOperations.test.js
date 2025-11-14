const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Batch Operations Tests", function () {
  let jumpAchievements;
  let owner, minter, addr1;
  
  beforeEach(async function () {
    [owner, minter, addr1] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    
    // Create achievements
    for (let i = 1; i <= 5; i++) {
      await jumpAchievements.createAchievement(i, `Test${i}`, `Description${i}`, 0, 0, true);
    }
  });
  
  describe("Batch Minting", function () {
    it("Should mint multiple achievements with different amounts", async function () {
      const ids = [1, 2, 3];
      const amounts = [1, 2, 3];
      
      await jumpAchievements.connect(minter).mintBatch(addr1.address, ids, amounts, "0x");
      
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(1);
      expect(await jumpAchievements.balanceOf(addr1.address, 2)).to.equal(2);
      expect(await jumpAchievements.balanceOf(addr1.address, 3)).to.equal(3);
    });
    
    it("Should handle large batch operations", async function () {
      const ids = [1, 2, 3, 4, 5];
      const amounts = [1, 1, 1, 1, 1];
      
      await jumpAchievements.connect(minter).mintBatch(addr1.address, ids, amounts, "0x");
      
      for (let i = 1; i <= 5; i++) {
        expect(await jumpAchievements.balanceOf(addr1.address, i)).to.equal(1);
      }
    });
  });
  
  describe("Batch Transfer", function () {
    beforeEach(async function () {
      const ids = [1, 2, 3];
      const amounts = [1, 1, 1];
      await jumpAchievements.connect(minter).mintBatch(addr1.address, ids, amounts, "0x");
    });
    
    it("Should transfer multiple achievements in batch", async function () {
      const addr2 = (await ethers.getSigners())[2];
      const ids = [1, 2, 3];
      const amounts = [1, 1, 1];
      
      await jumpAchievements.connect(addr1).safeBatchTransferFrom(
        addr1.address,
        addr2.address,
        ids,
        amounts,
        "0x"
      );
      
      for (const id of ids) {
        expect(await jumpAchievements.balanceOf(addr2.address, id)).to.equal(1);
      }
    });
  });
});

