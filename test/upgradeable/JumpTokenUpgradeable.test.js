const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("JumpTokenUpgradeable", function () {
  let jumpToken;
  let jumpTokenV2;
  let owner, minter, user;
  let JumpTokenV2;

  beforeEach(async function () {
    [owner, minter, user] = await ethers.getSigners();
    
    const JumpTokenUpgradeable = await ethers.getContractFactory("JumpTokenUpgradeable");
    jumpToken = await upgrades.deployProxy(
      JumpTokenUpgradeable,
      [owner.address],
      { initializer: "initialize" }
    );
    await jumpToken.waitForDeployment();
    
    // Prepare V2 implementation
    JumpTokenV2 = await ethers.getContractFactory("JumpTokenUpgradeableV2");
  });

  describe("Deployment", function () {
    it("Should initialize with correct values", async function () {
      expect(await jumpToken.name()).to.equal("Jump Token");
      expect(await jumpToken.symbol()).to.equal("JUMP");
      expect(await jumpToken.decimals()).to.equal(18);
    });

    it("Should grant roles to owner", async function () {
      const ADMIN_ROLE = await jumpToken.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await jumpToken.MINTER_ROLE();
      const PAUSER_ROLE = await jumpToken.PAUSER_ROLE();
      
      expect(await jumpToken.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
      expect(await jumpToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await jumpToken.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should mint tokens", async function () {
      await jumpToken.mint(user.address, ethers.parseEther("1000"));
      expect(await jumpToken.balanceOf(user.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Should not exceed max supply", async function () {
      const maxSupply = await jumpToken.MAX_SUPPLY();
      await expect(
        jumpToken.mint(user.address, maxSupply + ethers.parseEther("1"))
      ).to.be.revertedWith("JumpTokenUpgradeable: exceeds max supply");
    });
  });

  describe("Upgrades", function () {
    it("Should upgrade to V2", async function () {
      // Mint some tokens first
      await jumpToken.mint(user.address, ethers.parseEther("1000"));
      
      // Upgrade
      jumpTokenV2 = await upgrades.upgradeProxy(
        await jumpToken.getAddress(),
        JumpTokenV2
      );
      
      // Check that state is preserved
      expect(await jumpTokenV2.balanceOf(user.address)).to.equal(ethers.parseEther("1000"));
      expect(await jumpTokenV2.name()).to.equal("Jump Token");
    });

    it("Should not allow non-upgrader to upgrade", async function () {
      await expect(
        upgrades.upgradeProxy(
          await jumpToken.getAddress(),
          JumpTokenV2.connect(user)
        )
      ).to.be.reverted;
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause the contract", async function () {
      await jumpToken.pause();
      expect(await jumpToken.paused()).to.be.true;
    });

    it("Should not allow transfers when paused", async function () {
      await jumpToken.mint(user.address, ethers.parseEther("1000"));
      await jumpToken.pause();
      
      await expect(
        jumpToken.connect(user).transfer(owner.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(jumpToken, "EnforcedPause");
    });
  });
});

