const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Supply Tracking Tests", function () {
  let jumpToken;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
  });
  
  describe("Total Supply", function () {
    it("Should start with zero supply", async function () {
      expect(await jumpToken.totalSupply()).to.equal(0);
    });
    
    it("Should increase on minting", async function () {
      await jumpToken.mint(addr1.address, ethers.parseEther("100"));
      expect(await jumpToken.totalSupply()).to.equal(ethers.parseEther("100"));
      
      await jumpToken.mint(addr2.address, ethers.parseEther("200"));
      expect(await jumpToken.totalSupply()).to.equal(ethers.parseEther("300"));
    });
    
    it("Should decrease on burning", async function () {
      await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
      expect(await jumpToken.totalSupply()).to.equal(ethers.parseEther("1000"));
      
      await jumpToken.connect(addr1).burn(ethers.parseEther("100"));
      expect(await jumpToken.totalSupply()).to.equal(ethers.parseEther("900"));
    });
    
    it("Should track supply correctly with multiple operations", async function () {
      await jumpToken.mint(addr1.address, ethers.parseEther("1000"));
      await jumpToken.mint(addr2.address, ethers.parseEther("500"));
      expect(await jumpToken.totalSupply()).to.equal(ethers.parseEther("1500"));
      
      await jumpToken.connect(addr1).burn(ethers.parseEther("200"));
      expect(await jumpToken.totalSupply()).to.equal(ethers.parseEther("1300"));
    });
  });
  
  describe("Max Supply", function () {
    it("Should enforce max supply limit", async function () {
      const maxSupply = await jumpToken.MAX_SUPPLY();
      
      // Mint up to max
      await jumpToken.mint(addr1.address, maxSupply);
      expect(await jumpToken.totalSupply()).to.equal(maxSupply);
      
      // Try to mint more
      await expect(
        jumpToken.mint(addr2.address, 1)
      ).to.be.revertedWith("JumpToken: max supply exceeded");
    });
  });
});

