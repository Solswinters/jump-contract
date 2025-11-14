const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Overflow Protection Tests", function () {
  let jumpToken;
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const JumpToken = await ethers.getContractFactory("JumpToken");
    jumpToken = await JumpToken.deploy();
    await jumpToken.waitForDeployment();
  });
  
  describe("Max Supply Protection", function () {
    it("Should prevent minting beyond max supply", async function () {
      const maxSupply = await jumpToken.MAX_SUPPLY();
      
      // Mint up to max supply
      await jumpToken.mint(addr1.address, maxSupply);
      expect(await jumpToken.totalSupply()).to.equal(maxSupply);
      
      // Attempt to mint more should fail
      await expect(
        jumpToken.mint(addr1.address, 1)
      ).to.be.revertedWith("JumpToken: max supply exceeded");
    });
    
    it("Should handle large mint amounts correctly", async function () {
      const largeAmount = ethers.parseEther("1000000");
      await jumpToken.mint(addr1.address, largeAmount);
      
      expect(await jumpToken.balanceOf(addr1.address)).to.equal(largeAmount);
    });
  });
  
  describe("Tier System Score Limits", function () {
    let tierSystem;
    
    beforeEach(async function () {
      const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
      tierSystem = await JumpTierSystem.deploy();
      await tierSystem.waitForDeployment();
    });
    
    it("Should handle maximum uint256 score", async function () {
      const maxScore = ethers.MaxUint256;
      const tier = await tierSystem.getTierForScore(maxScore);
      
      // Should return tier 5 (highest tier)
      expect(tier).to.equal(5);
    });
    
    it("Should handle very large scores", async function () {
      const largeScore = ethers.parseEther("1000000");
      const tier = await tierSystem.getTierForScore(largeScore);
      
      expect(tier).to.equal(5);
    });
  });
});

