const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Transfer Events Tests", function () {
  let jumpToken;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
  });
  
  describe("Transfer Events", function () {
    it("Should emit Transfer event on transfer", async function () {
      await expect(
        jumpToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      )
        .to.emit(jumpToken, "Transfer")
        .withArgs(addr1.address, addr2.address, ethers.parseEther("100"));
    });
    
    it("Should emit Transfer event on mint", async function () {
      await expect(
        jumpToken.mint(addr2.address, ethers.parseEther("100"))
      )
        .to.emit(jumpToken, "Transfer")
        .withArgs(ethers.ZeroAddress, addr2.address, ethers.parseEther("100"));
    });
    
    it("Should emit Transfer event on burn", async function () {
      await expect(
        jumpToken.connect(addr1).burn(ethers.parseEther("100"))
      )
        .to.emit(jumpToken, "Transfer")
        .withArgs(addr1.address, ethers.ZeroAddress, ethers.parseEther("100"));
    });
  });
  
  describe("Approval Events", function () {
    it("Should emit Approval event", async function () {
      await expect(
        jumpToken.connect(addr1).approve(addr2.address, ethers.parseEther("100"))
      )
        .to.emit(jumpToken, "Approval")
        .withArgs(addr1.address, addr2.address, ethers.parseEther("100"));
    });
  });
});

