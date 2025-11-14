const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Batch Transfer Edge Cases Tests", function () {
  let jumpToken;
  let owner, addr1, addr2, addr3;
  
  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
  });
  
  describe("Array Validation", function () {
    it("Should revert when arrays are empty", async function () {
      await expect(
        jumpToken.connect(addr1).batchTransfer([], [])
      ).to.be.revertedWith("JumpToken: empty arrays");
    });
    
    it("Should revert when arrays length mismatch", async function () {
      const recipients = [addr2.address, addr3.address];
      const amounts = [ethers.parseEther("100")];
      
      await expect(
        jumpToken.connect(addr1).batchTransfer(recipients, amounts)
      ).to.be.revertedWith("JumpToken: arrays length mismatch");
    });
  });
  
  describe("Zero Address Handling", function () {
    it("Should revert when recipient is zero address", async function () {
      const recipients = [addr2.address, ethers.ZeroAddress];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];
      
      await expect(
        jumpToken.connect(addr1).batchTransfer(recipients, amounts)
      ).to.be.revertedWith("JumpToken: transfer to zero address");
    });
  });
  
  describe("Insufficient Balance", function () {
    it("Should revert when total amount exceeds balance", async function () {
      const recipients = [addr2.address, addr3.address];
      const amounts = [
        ethers.parseEther("600"),
        ethers.parseEther("500")
      ];
      
      await expect(
        jumpToken.connect(addr1).batchTransfer(recipients, amounts)
      ).to.be.reverted;
    });
  });
  
  describe("Paused State", function () {
    it("Should prevent batch transfer when paused", async function () {
      await jumpToken.pause();
      
      const recipients = [addr2.address];
      const amounts = [ethers.parseEther("100")];
      
      await expect(
        jumpToken.connect(addr1).batchTransfer(recipients, amounts)
      ).to.be.reverted;
    });
  });
});

