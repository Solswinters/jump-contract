const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Allowance Tests", function () {
  let jumpToken;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
  });
  
  describe("Allowance Management", function () {
    it("Should start with zero allowance", async function () {
      expect(await jumpToken.allowance(addr1.address, addr2.address)).to.equal(0);
    });
    
    it("Should set allowance correctly", async function () {
      const amount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, amount);
      
      expect(await jumpToken.allowance(addr1.address, addr2.address)).to.equal(amount);
    });
    
    it("Should allow increasing allowance", async function () {
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("100"));
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("200"));
      
      expect(await jumpToken.allowance(addr1.address, addr2.address)).to.equal(ethers.parseEther("200"));
    });
    
    it("Should allow decreasing allowance", async function () {
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("200"));
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("100"));
      
      expect(await jumpToken.allowance(addr1.address, addr2.address)).to.equal(ethers.parseEther("100"));
    });
  });
  
  describe("TransferFrom with Allowance", function () {
    it("Should transfer with sufficient allowance", async function () {
      const amount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, amount);
      
      await jumpToken.connect(addr2).transferFrom(addr1.address, owner.address, amount);
      
      expect(await jumpToken.balanceOf(owner.address)).to.equal(amount);
      expect(await jumpToken.allowance(addr1.address, addr2.address)).to.equal(0);
    });
    
    it("Should decrease allowance after transferFrom", async function () {
      const approvedAmount = ethers.parseEther("200");
      const transferAmount = ethers.parseEther("100");
      
      await jumpToken.connect(addr1).approve(addr2.address, approvedAmount);
      await jumpToken.connect(addr2).transferFrom(addr1.address, owner.address, transferAmount);
      
      const remaining = await jumpToken.allowance(addr1.address, addr2.address);
      expect(remaining).to.equal(ethers.parseEther("100"));
    });
  });
});

