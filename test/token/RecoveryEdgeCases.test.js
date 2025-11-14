const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Recovery Edge Cases", function () {
  let jumpToken;
  let mockERC20;
  let owner, addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
    
    // Deploy mock ERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MOCK");
    await mockERC20.waitForDeployment();
  });
  
  describe("Recovery Scenarios", function () {
    it("Should recover full amount", async function () {
      const amount = ethers.parseEther("100");
      await mockERC20.transfer(await jumpToken.getAddress(), amount);
      
      const balanceBefore = await mockERC20.balanceOf(addr1.address);
      await jumpToken.recoverERC20(await mockERC20.getAddress(), addr1.address, amount);
      const balanceAfter = await mockERC20.balanceOf(addr1.address);
      
      expect(balanceAfter - balanceBefore).to.equal(amount);
    });
    
    it("Should recover partial amount", async function () {
      const sentAmount = ethers.parseEther("100");
      const recoverAmount = ethers.parseEther("50");
      
      await mockERC20.transfer(await jumpToken.getAddress(), sentAmount);
      await jumpToken.recoverERC20(await mockERC20.getAddress(), addr1.address, recoverAmount);
      
      const contractBalance = await mockERC20.balanceOf(await jumpToken.getAddress());
      expect(contractBalance).to.equal(ethers.parseEther("50"));
    });
    
    it("Should revert when recovering more than available", async function () {
      const sentAmount = ethers.parseEther("100");
      const recoverAmount = ethers.parseEther("200");
      
      await mockERC20.transfer(await jumpToken.getAddress(), sentAmount);
      
      await expect(
        jumpToken.recoverERC20(await mockERC20.getAddress(), addr1.address, recoverAmount)
      ).to.be.reverted;
    });
  });
  
  describe("Access Control", function () {
    it("Should revert when non-admin tries to recover", async function () {
      await mockERC20.transfer(await jumpToken.getAddress(), ethers.parseEther("100"));
      
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

