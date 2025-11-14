const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Burn Edge Cases", function () {
  let jumpToken;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
  });
  
  describe("Burn Operations", function () {
    it("Should burn exact balance", async function () {
      const balance = await jumpToken.balanceOf(addr1.address);
      await jumpToken.connect(addr1).burn(balance);
      
      expect(await jumpToken.balanceOf(addr1.address)).to.equal(0);
    });
    
    it("Should revert when burning more than balance", async function () {
      const balance = await jumpToken.balanceOf(addr1.address);
      
      await expect(
        jumpToken.connect(addr1).burn(balance + 1n)
      ).to.be.reverted;
    });
    
    it("Should revert when burning zero amount", async function () {
      await expect(
        jumpToken.connect(addr1).burn(0)
      ).to.be.reverted;
    });
  });
  
  describe("BurnFrom Operations", function () {
    it("Should burn with sufficient allowance", async function () {
      const burnAmount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, burnAmount);
      
      await jumpToken.connect(addr2).burnFrom(addr1.address, burnAmount);
      
      expect(await jumpToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("900"));
    });
    
    it("Should revert when allowance insufficient", async function () {
      const burnAmount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("50"));
      
      await expect(
        jumpToken.connect(addr2).burnFrom(addr1.address, burnAmount)
      ).to.be.revertedWith("JumpToken: insufficient allowance");
    });
    
    it("Should revert when burning from zero address", async function () {
      await expect(
        jumpToken.burnFrom(ethers.ZeroAddress, ethers.parseEther("100"))
      ).to.be.revertedWith("JumpToken: burn from zero address");
    });
  });
  
  describe("Paused State", function () {
    it("Should prevent burning when paused", async function () {
      await jumpToken.pause();
      
      await expect(
        jumpToken.connect(addr1).burn(ethers.parseEther("100"))
      ).to.be.reverted;
    });
  });
});

