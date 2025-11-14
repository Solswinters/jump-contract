const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Transfer Restrictions Tests", function () {
  let jumpAchievements;
  let owner, minter, addr1, addr2;
  
  beforeEach(async function () {
    [owner, minter, addr1, addr2] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    
    // Create transferable achievement
    await jumpAchievements.createAchievement(1, "Transferable", "Can transfer", 0, 0, true);
    // Create soulbound achievement
    await jumpAchievements.createAchievement(2, "Soulbound", "Cannot transfer", 0, 0, false);
    
    // Mint both to addr1
    await jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x");
    await jumpAchievements.connect(minter).mint(addr1.address, 2, 1, "0x");
  });
  
  describe("Transferable Achievements", function () {
    it("Should allow transfer of transferable achievement", async function () {
      await jumpAchievements.connect(addr1).safeTransferFrom(
        addr1.address,
        addr2.address,
        1,
        1,
        "0x"
      );
      
      expect(await jumpAchievements.balanceOf(addr2.address, 1)).to.equal(1);
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(0);
    });
  });
  
  describe("Soulbound Achievements", function () {
    it("Should prevent transfer of soulbound achievement", async function () {
      await expect(
        jumpAchievements.connect(addr1).safeTransferFrom(
          addr1.address,
          addr2.address,
          2,
          1,
          "0x"
        )
      ).to.be.revertedWith("JumpAchievements: soulbound achievement cannot be transferred");
    });
    
    it("Should allow minting soulbound achievements", async function () {
      await expect(
        jumpAchievements.connect(minter).mint(addr2.address, 2, 1, "0x")
      ).to.not.be.reverted;
    });
    
    it("Should allow burning soulbound achievements", async function () {
      await expect(
        jumpAchievements.connect(addr1).burn(addr1.address, 2, 1)
      ).to.not.be.reverted;
    });
  });
  
  describe("Batch Transfers", function () {
    it("Should prevent batch transfer if any achievement is soulbound", async function () {
      await expect(
        jumpAchievements.connect(addr1).safeBatchTransferFrom(
          addr1.address,
          addr2.address,
          [1, 2],
          [1, 1],
          "0x"
        )
      ).to.be.revertedWith("JumpAchievements: soulbound achievement cannot be transferred");
    });
    
    it("Should allow batch transfer of only transferable achievements", async function () {
      // Mint another transferable achievement
      await jumpAchievements.createAchievement(3, "Transferable2", "Can transfer", 0, 0, true);
      await jumpAchievements.connect(minter).mint(addr1.address, 3, 1, "0x");
      
      await jumpAchievements.connect(addr1).safeBatchTransferFrom(
        addr1.address,
        addr2.address,
        [1, 3],
        [1, 1],
        "0x"
      );
      
      expect(await jumpAchievements.balanceOf(addr2.address, 1)).to.equal(1);
      expect(await jumpAchievements.balanceOf(addr2.address, 3)).to.equal(1);
    });
  });
});

