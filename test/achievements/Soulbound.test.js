const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Soulbound Achievement Tests", function () {
  let jumpAchievements;
  let owner, minter, addr1, addr2;
  
  beforeEach(async function () {
    [owner, minter, addr1, addr2] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
  });
  
  describe("Non-Transferable Achievements", function () {
    beforeEach(async function () {
      // Create soulbound achievement (transferable = false)
      await jumpAchievements.createAchievement(1, "Soulbound", "Cannot transfer", 0, 0, false);
      
      // Create transferable achievement
      await jumpAchievements.createAchievement(2, "Transferable", "Can transfer", 0, 0, true);
      
      // Mint both to addr1
      await jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x");
      await jumpAchievements.connect(minter).mint(addr1.address, 2, 1, "0x");
    });
    
    it("Should prevent transfer of soulbound achievement", async function () {
      await expect(
        jumpAchievements.connect(addr1).safeTransferFrom(
          addr1.address,
          addr2.address,
          1,
          1,
          "0x"
        )
      ).to.be.revertedWith("JumpAchievements: soulbound achievement cannot be transferred");
    });
    
    it("Should allow transfer of transferable achievement", async function () {
      await jumpAchievements.connect(addr1).safeTransferFrom(
        addr1.address,
        addr2.address,
        2,
        1,
        "0x"
      );
      
      expect(await jumpAchievements.balanceOf(addr2.address, 2)).to.equal(1);
    });
    
    it("Should allow minting soulbound achievements", async function () {
      await expect(
        jumpAchievements.connect(minter).mint(addr2.address, 1, 1, "0x")
      ).to.not.be.reverted;
    });
    
    it("Should allow burning soulbound achievements", async function () {
      await expect(
        jumpAchievements.connect(addr1).burn(addr1.address, 1, 1)
      ).to.not.be.reverted;
    });
  });
});

