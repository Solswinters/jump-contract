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
});

