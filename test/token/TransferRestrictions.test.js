const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transfer Restrictions Tests", function () {
  let jumpToken;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
  });
  
  describe("Paused Transfers", function () {
    it("Should prevent transfers when paused", async function () {
      await jumpToken.pause();
      
      await expect(
        jumpToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should prevent approvals when paused", async function () {
      await jumpToken.pause();
      
      await expect(
        jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should allow transfers after unpause", async function () {
      await jumpToken.pause();
      await jumpToken.unpause();
      
      await expect(
        jumpToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
  });
  
  describe("Zero Address Transfers", function () {
    it("Should revert when transferring to zero address", async function () {
      await expect(
        jumpToken.connect(addr1).transfer(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should revert when transferring from zero address", async function () {
      await expect(
        jumpToken.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
  });
  
  describe("Insufficient Balance", function () {
    it("Should revert when transferring more than balance", async function () {
      const balance = await jumpToken.balanceOf(addr1.address);
      
      await expect(
        jumpToken.connect(addr1).transfer(addr2.address, balance + 1n)
      ).to.be.reverted;
    });
  });
});

