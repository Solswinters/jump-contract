const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Recovery Tests", function () {
  let jumpToken;
  let mockERC20;
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    // Deploy mock ERC20 for testing recovery
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MOCK");
    await mockERC20.waitForDeployment();
  });
  
  describe("ERC20 Recovery", function () {
    it("Should recover accidentally sent ERC20 tokens", async function () {
      // Send mock tokens to JumpToken contract
      await mockERC20.transfer(await jumpToken.getAddress(), ethers.parseEther("100"));
      
      const balanceBefore = await mockERC20.balanceOf(addr1.address);
      
      // Recover tokens
      await jumpToken.recoverERC20(
        await mockERC20.getAddress(),
        addr1.address,
        ethers.parseEther("100")
      );
      
      const balanceAfter = await mockERC20.balanceOf(addr1.address);
      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("100"));
    });
    
    it("Should revert when trying to recover JUMP tokens", async function () {
      await expect(
        jumpToken.recoverERC20(
          await jumpToken.getAddress(),
          addr1.address,
          ethers.parseEther("100")
        )
      ).to.be.revertedWith("JumpToken: cannot recover JUMP tokens");
    });
    
    it("Should revert when recovering to zero address", async function () {
      await expect(
        jumpToken.recoverERC20(
          await mockERC20.getAddress(),
          ethers.ZeroAddress,
          ethers.parseEther("100")
        )
      ).to.be.revertedWith("JumpToken: recover to zero address");
    });
    
    it("Should revert when non-admin tries to recover", async function () {
      await expect(
        jumpToken.connect(addr1).recoverERC20(
          await mockERC20.getAddress(),
          addr1.address,
          ethers.parseEther("100")
        )
      ).to.be.reverted;
    });
  });
});

