const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JumpToken", function () {
  let jumpToken;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await jumpToken.name()).to.equal("Jump Token");
      expect(await jumpToken.symbol()).to.equal("JUMP");
    });
    
    it("Should set the correct decimals", async function () {
      expect(await jumpToken.decimals()).to.equal(18);
    });
    
    it("Should grant roles to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await jumpToken.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      const PAUSER_ROLE = await jumpToken.PAUSER_ROLE();
      
      expect(await jumpToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await jumpToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await jumpToken.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
    });
  });
  
  describe("Minting", function () {
    it("Should mint tokens to an address", async function () {
      const amount = ethers.parseEther("100");
      await jumpToken.mint(addr1.address, amount);
      expect(await jumpToken.balanceOf(addr1.address)).to.equal(amount);
    });
    
    it("Should emit TokensMinted event", async function () {
      const amount = ethers.parseEther("100");
      await expect(jumpToken.mint(addr1.address, amount))
        .to.emit(jumpToken, "TokensMinted")
        .withArgs(addr1.address, amount, owner.address);
    });
    
    it("Should revert when minting to zero address", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        jumpToken.mint(ethers.ZeroAddress, amount)
      ).to.be.revertedWith("JumpToken: mint to zero address");
    });
    
    it("Should revert when non-minter tries to mint", async function () {
      const amount = ethers.parseEther("100");
      await expect(
        jumpToken.connect(addr1).mint(addr2.address, amount)
      ).to.be.reverted;
    });
  });
  
  describe("Burning", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1000");
      await jumpToken.mint(addr1.address, amount);
    });
    
    it("Should burn tokens from sender's account", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await jumpToken.balanceOf(addr1.address);
      
      await jumpToken.connect(addr1).burn(burnAmount);
      
      expect(await jumpToken.balanceOf(addr1.address))
        .to.equal(initialBalance - burnAmount);
    });
    
    it("Should emit TokensBurned event", async function () {
      const burnAmount = ethers.parseEther("100");
      await expect(jumpToken.connect(addr1).burn(burnAmount))
        .to.emit(jumpToken, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });
    
    it("Should burnFrom with allowance", async function () {
      const burnAmount = ethers.parseEther("100");
      
      await jumpToken.connect(addr1).approve(addr2.address, burnAmount);
      await jumpToken.connect(addr2).burnFrom(addr1.address, burnAmount);
      
      expect(await jumpToken.balanceOf(addr1.address))
        .to.equal(ethers.parseEther("900"));
    });
  });
  
  describe("Pause Functionality", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1000");
      await jumpToken.mint(addr1.address, amount);
      await jumpToken.mint(addr2.address, amount);
    });
    
    it("Should pause all transfers", async function () {
      await jumpToken.pause();
      
      await expect(
        jumpToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should unpause and allow transfers", async function () {
      await jumpToken.pause();
      await jumpToken.unpause();
      
      await expect(
        jumpToken.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
    
    it("Should emit ContractPaused event", async function () {
      await expect(jumpToken.pause())
        .to.emit(jumpToken, "ContractPaused")
        .withArgs(owner.address);
    });
    
    it("Should emit ContractUnpaused event", async function () {
      await jumpToken.pause();
      await expect(jumpToken.unpause())
        .to.emit(jumpToken, "ContractUnpaused")
        .withArgs(owner.address);
    });
  });
});

