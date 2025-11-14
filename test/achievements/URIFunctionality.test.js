const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Achievement URI Functionality Tests", function () {
  let jumpAchievements;
  let owner, uriSetter;
  
  beforeEach(async function () {
    [owner, uriSetter] = await ethers.getSigners();
    
    const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
    jumpAchievements = await JumpAchievements.deploy("https://initial.uri/");
    await jumpAchievements.waitForDeployment();
    
    const URI_SETTER_ROLE = await jumpAchievements.URI_SETTER_ROLE();
    await jumpAchievements.grantRole(URI_SETTER_ROLE, uriSetter.address);
  });
  
  describe("URI Retrieval", function () {
    it("Should return correct URI for token ID", async function () {
      const uri = await jumpAchievements.uri(1);
      expect(uri).to.equal("https://initial.uri/1");
    });
    
    it("Should format URI correctly for different token IDs", async function () {
      expect(await jumpAchievements.uri(1)).to.equal("https://initial.uri/1");
      expect(await jumpAchievements.uri(100)).to.equal("https://initial.uri/100");
      expect(await jumpAchievements.uri(999)).to.equal("https://initial.uri/999");
    });
  });
  
  describe("URI Updates", function () {
    it("Should allow URI setter to update URI", async function () {
      const newURI = "https://new.uri/";
      await jumpAchievements.connect(uriSetter).setURI(newURI);
      
      const uri = await jumpAchievements.uri(1);
      expect(uri).to.equal(newURI + "1");
    });
    
    it("Should allow admin to update URI", async function () {
      const newURI = "https://admin.uri/";
      await jumpAchievements.setURI(newURI);
      
      const uri = await jumpAchievements.uri(1);
      expect(uri).to.equal(newURI + "1");
    });
    
    it("Should revert when non-authorized tries to update URI", async function () {
      const [unauthorized] = await ethers.getSigners();
      
      await expect(
        jumpAchievements.connect(unauthorized).setURI("https://new.uri/")
      ).to.be.reverted;
    });
  });
});

