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
});

