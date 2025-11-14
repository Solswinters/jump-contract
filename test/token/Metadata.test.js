const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Metadata Tests", function () {
  let jumpToken;
  let owner;
  
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
  });
  
  describe("Token Information", function () {
    it("Should have correct name", async function () {
      expect(await jumpToken.name()).to.equal("Jump Token");
    });
    
    it("Should have correct symbol", async function () {
      expect(await jumpToken.symbol()).to.equal("JUMP");
    });
    
    it("Should have 18 decimals", async function () {
      expect(await jumpToken.decimals()).to.equal(18);
    });
  });
  
  describe("Max Supply", function () {
    it("Should have correct max supply", async function () {
      const maxSupply = await jumpToken.MAX_SUPPLY();
      expect(maxSupply).to.equal(ethers.parseEther("100000000")); // 100 million
    });
    
    it("Should start with zero total supply", async function () {
      expect(await jumpToken.totalSupply()).to.equal(0);
    });
  });
  
  describe("Initial State", function () {
    it("Should not be paused initially", async function () {
      expect(await jumpToken.paused()).to.be.false;
    });
    
    it("Should have zero total supply", async function () {
      expect(await jumpToken.totalSupply()).to.equal(0);
    });
  });
});

