const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Constants Tests", function () {
  let jumpToken;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
  });
  
  describe("Token Constants", function () {
    it("Should have correct name", async function () {
      expect(await jumpToken.name()).to.equal("Jump Token");
    });
    
    it("Should have correct symbol", async function () {
      expect(await jumpToken.symbol()).to.equal("JUMP");
    });
    
    it("Should have 18 decimals", async function () {
      expect(await jumpToken.decimals()).to.equal(18);
    });
    
    it("Should have correct max supply", async function () {
      const maxSupply = await jumpToken.MAX_SUPPLY();
      expect(maxSupply).to.equal(ethers.parseEther("100000000")); // 100 million
    });
  });
  
  describe("Role Constants", function () {
    it("Should have MINTER_ROLE defined", async function () {
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      expect(MINTER_ROLE).to.not.equal(ethers.ZeroHash);
    });
    
    it("Should have PAUSER_ROLE defined", async function () {
      const PAUSER_ROLE = await jumpToken.PAUSER_ROLE();
      expect(PAUSER_ROLE).to.not.equal(ethers.ZeroHash);
    });
    
    it("Should have DEFAULT_ADMIN_ROLE defined", async function () {
      const ADMIN_ROLE = await jumpToken.DEFAULT_ADMIN_ROLE();
      expect(ADMIN_ROLE).to.not.equal(ethers.ZeroHash);
    });
  });
});

