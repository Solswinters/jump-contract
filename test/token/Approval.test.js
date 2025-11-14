const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Approval Tests", function () {
  let jumpToken;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
  });
  
  describe("Approval Operations", function () {
    it("Should approve spender", async function () {
      const amount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, amount);
      
      const allowance = await jumpToken.allowance(addr1.address, addr2.address);
      expect(allowance).to.equal(amount);
    });
    
    it("Should emit Approval event", async function () {
      const amount = ethers.parseEther("100");
      await expect(jumpToken.connect(addr1).approve(addr2.address, amount))
        .to.emit(jumpToken, "Approval")
        .withArgs(addr1.address, addr2.address, amount);
    });
    
    it("Should allow transferFrom with approval", async function () {
      const amount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, amount);
      
      await jumpToken.connect(addr2).transferFrom(addr1.address, owner.address, amount);
      
      expect(await jumpToken.balanceOf(owner.address)).to.equal(amount);
    });
    
    it("Should decrease allowance after transferFrom", async function () {
      const amount = ethers.parseEther("100");
      await jumpToken.connect(addr1).approve(addr2.address, amount);
      
      await jumpToken.connect(addr2).transferFrom(addr1.address, owner.address, ethers.parseEther("50"));
      
      const remaining = await jumpToken.allowance(addr1.address, addr2.address);
      expect(remaining).to.equal(ethers.parseEther("50"));
    });
  });
  
  describe("Approval Edge Cases", function () {
    it("Should allow increasing approval", async function () {
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("100"));
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("200"));
      
      const allowance = await jumpToken.allowance(addr1.address, addr2.address);
      expect(allowance).to.equal(ethers.parseEther("200"));
    });
    
    it("Should allow decreasing approval", async function () {
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("200"));
      await jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("100"));
      
      const allowance = await jumpToken.allowance(addr1.address, addr2.address);
      expect(allowance).to.equal(ethers.parseEther("100"));
    });
  });
});

