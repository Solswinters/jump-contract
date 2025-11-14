const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("URI Management Tests", function () {
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
  
  describe("URI Setting", function () {
    it("Should allow URI setter to update URI", async function () {
      const newURI = "https://new.uri/";
      await jumpAchievements.connect(uriSetter).setURI(newURI);
      
      // Check URI by calling uri() function (ERC1155 standard)
      const uri = await jumpAchievements.uri(1);
      expect(uri).to.equal(newURI + "1");
    });
    
    it("Should revert when non-URI-setter tries to update URI", async function () {
      const [unauthorized] = await ethers.getSigners();
      
      await expect(
        jumpAchievements.connect(unauthorized).setURI("https://new.uri/")
      ).to.be.reverted;
    });
    
    it("Should allow admin to update URI", async function () {
      const newURI = "https://admin.uri/";
      await jumpAchievements.setURI(newURI);
      
      const uri = await jumpAchievements.uri(1);
      expect(uri).to.equal(newURI + "1");
    });
  });
  
  describe("URI Format", function () {
    it("Should format URI correctly for token IDs", async function () {
      const baseURI = "https://test.uri/";
      await jumpAchievements.setURI(baseURI);
      
      expect(await jumpAchievements.uri(1)).to.equal(baseURI + "1");
      expect(await jumpAchievements.uri(100)).to.equal(baseURI + "100");
      expect(await jumpAchievements.uri(999)).to.equal(baseURI + "999");
    });
  });
});

