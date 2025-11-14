const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement Access Control Tests", function () {
  let jumpAchievements;
  let owner, minter, pauser, uriSetter, unauthorized;
  
  beforeEach(async function () {
    [owner, minter, pauser, uriSetter, unauthorized] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
    await jumpAchievements.waitForDeployment();
    
    const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
    const PAUSER_ROLE = await jumpAchievements.PAUSER_ROLE();
    const URI_SETTER_ROLE = await jumpAchievements.URI_SETTER_ROLE();
    
    await jumpAchievements.grantRole(MINTER_ROLE, minter.address);
    await jumpAchievements.grantRole(PAUSER_ROLE, pauser.address);
    await jumpAchievements.grantRole(URI_SETTER_ROLE, uriSetter.address);
    
    await jumpAchievements.createAchievement(1, "Test", "Test", 0, 0, true);
  });
  
  describe("Role Verification", function () {
    it("Should verify minter has MINTER_ROLE", async function () {
      const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
      expect(await jumpAchievements.hasRole(MINTER_ROLE, minter.address)).to.be.true;
    });
    
    it("Should verify pauser has PAUSER_ROLE", async function () {
      const PAUSER_ROLE = await jumpAchievements.PAUSER_ROLE();
      expect(await jumpAchievements.hasRole(PAUSER_ROLE, pauser.address)).to.be.true;
    });
    
    it("Should verify uriSetter has URI_SETTER_ROLE", async function () {
      const URI_SETTER_ROLE = await jumpAchievements.URI_SETTER_ROLE();
      expect(await jumpAchievements.hasRole(URI_SETTER_ROLE, uriSetter.address)).to.be.true;
    });
    
    it("Should verify unauthorized has no roles", async function () {
      const MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
      expect(await jumpAchievements.hasRole(MINTER_ROLE, unauthorized.address)).to.be.false;
    });
  });
  
  describe("Role-Based Operations", function () {
    it("Should allow minter to mint", async function () {
      await expect(
        jumpAchievements.connect(minter).mint(unauthorized.address, 1, 1, "0x")
      ).to.not.be.reverted;
    });
    
    it("Should allow pauser to pause", async function () {
      await expect(
        jumpAchievements.connect(pauser).pause()
      ).to.not.be.reverted;
    });
    
    it("Should allow uriSetter to set URI", async function () {
      await expect(
        jumpAchievements.connect(uriSetter).setURI("https://new.uri/")
      ).to.not.be.reverted;
    });
  });
});

