const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Role Management Security Tests", function () {
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
  
  describe("MINTER_ROLE", function () {
    it("Should allow admin to grant MINTER_ROLE", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      await jumpToken.grantRole(MINTER_ROLE, addr1.address);
      
      expect(await jumpToken.hasRole(MINTER_ROLE, addr1.address)).to.be.true;
    });
    
    it("Should allow minter to mint tokens", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      await jumpToken.grantRole(MINTER_ROLE, addr1.address);
      
      await jumpToken.connect(addr1).mint(addr2.address, ethers.parseEther("100"));
      expect(await jumpToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("100"));
    });
    
    it("Should prevent non-minter from minting", async function () {
      await expect(
        jumpToken.connect(addr1).mint(addr2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
    
    it("Should allow admin to revoke MINTER_ROLE", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      await jumpToken.grantRole(MINTER_ROLE, addr1.address);
      await jumpToken.revokeRole(MINTER_ROLE, addr1.address);
      
      expect(await jumpToken.hasRole(MINTER_ROLE, addr1.address)).to.be.false;
    });
  });
  
  describe("PAUSER_ROLE", function () {
    it("Should allow pauser to pause contract", async function () {
      const PAUSER_ROLE = await jumpToken.PAUSER_ROLE();
      await jumpToken.grantRole(PAUSER_ROLE, addr1.address);
      
      await jumpToken.connect(addr1).pause();
      expect(await jumpToken.paused()).to.be.true;
    });
    
    it("Should prevent non-pauser from pausing", async function () {
      await expect(
        jumpToken.connect(addr1).pause()
      ).to.be.reverted;
    });
  });
});

