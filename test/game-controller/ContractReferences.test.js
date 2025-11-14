const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("../helpers/setup");

describe("Game Controller Contract References Tests", function () {
  let contracts;
  let owner;
  
  beforeEach(async function () {
    contracts = await deployContracts();
    owner = contracts.owner;
  });
  
  describe("Contract Address Storage", function () {
    it("Should store correct JumpToken address", async function () {
      const tokenAddress = await contracts.gameController.jumpToken();
      expect(tokenAddress).to.equal(await contracts.jumpToken.getAddress());
    });
    
    it("Should store correct JumpAchievements address", async function () {
      const achievementsAddress = await contracts.gameController.jumpAchievements();
      expect(achievementsAddress).to.equal(await contracts.jumpAchievements.getAddress());
    });
    
    it("Should store correct JumpTierSystem address", async function () {
      const tierSystemAddress = await contracts.gameController.tierSystem();
      expect(tierSystemAddress).to.equal(await contracts.tierSystem.getAddress());
    });
  });
  
  describe("Contract Interaction", function () {
    it("Should interact with JumpToken correctly", async function () {
      const tokenAddress = await contracts.gameController.jumpToken();
      const token = await ethers.getContractAt("JumpToken", tokenAddress);
      
      const name = await token.name();
      expect(name).to.equal("Jump Token");
    });
    
    it("Should interact with JumpTierSystem correctly", async function () {
      const tierSystemAddress = await contracts.gameController.tierSystem();
      const tierSystem = await ethers.getContractAt("JumpTierSystem", tierSystemAddress);
      
      const tierCount = await tierSystem.tierCount();
      expect(tierCount).to.equal(5);
    });
  });
});

