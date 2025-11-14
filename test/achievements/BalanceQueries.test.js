const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Balance Query Tests", function () {
  let jumpAchievements;
  let owner, minter, addr1, addr2;
  
  beforeEach(async function () {
    [owner, minter, addr1, addr2] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    
    await jumpAchievements.createAchievement(1, "Test1", "Test1", 0, 0, true);
    await jumpAchievements.createAchievement(2, "Test2", "Test2", 0, 0, true);
  });
  
  describe("Balance Queries", function () {
    it("Should return zero for non-existent achievement", async function () {
      expect(await jumpAchievements.balanceOf(addr1.address, 999)).to.equal(0);
    });
    
    it("Should return zero for address without achievement", async function () {
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(0);
    });
    
    it("Should return correct balance after minting", async function () {
      await jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x");
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(1);
    });
    
    it("Should return correct balance for multiple achievements", async function () {
      await jumpAchievements.connect(minter).mint(addr1.address, 1, 2, "0x");
      await jumpAchievements.connect(minter).mint(addr1.address, 2, 3, "0x");
      
      expect(await jumpAchievements.balanceOf(addr1.address, 1)).to.equal(2);
      expect(await jumpAchievements.balanceOf(addr1.address, 2)).to.equal(3);
    });
  });
  
  describe("Batch Balance Queries", function () {
    beforeEach(async function () {
      await jumpAchievements.connect(minter).mint(addr1.address, 1, 1, "0x");
      await jumpAchievements.connect(minter).mint(addr1.address, 2, 2, "0x");
    });
    
    it("Should return correct balances for multiple IDs", async function () {
      const ids = [1, 2];
      const balances = await jumpAchievements.balanceOfBatch(
        [addr1.address, addr1.address],
        ids
      );
      
      expect(balances[0]).to.equal(1);
      expect(balances[1]).to.equal(2);
    });
  });
});

