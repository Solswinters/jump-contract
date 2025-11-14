const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JumpAccessControl", function () {
  let accessControl;
  let owner, admin, minter, pauser, gameOperator, user;
  let contract1, contract2;

  beforeEach(async function () {
    [owner, admin, minter, pauser, gameOperator, user] = await ethers.getSigners();
    
    // Deploy mock contracts for testing
    const MockContract = await ethers.getContractFactory("MockERC20");
    contract1 = await MockContract.deploy();
    contract2 = await MockContract.deploy();
    
    const JumpAccessControl = await ethers.getContractFactory("JumpAccessControl");
    accessControl = await JumpAccessControl.deploy();
  });

  describe("Deployment", function () {
    it("Should grant ADMIN_ROLE to deployer", async function () {
      expect(await accessControl.hasRole(await accessControl.ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should grant PAUSER_ROLE to deployer", async function () {
      expect(await accessControl.hasRole(await accessControl.PAUSER_ROLE(), owner.address)).to.be.true;
    });
  });

  describe("Contract Registration", function () {
    it("Should register a contract", async function () {
      await accessControl.registerContract(contract1.address, "MockContract1");
      expect(await accessControl.registeredContracts(contract1.address)).to.be.true;
    });

    it("Should not allow non-admin to register contract", async function () {
      await expect(
        accessControl.connect(user).registerContract(contract1.address, "MockContract1")
      ).to.be.revertedWithCustomError(accessControl, "AccessControlUnauthorizedAccount");
    });

    it("Should not allow zero address registration", async function () {
      await expect(
        accessControl.registerContract(ethers.ZeroAddress, "Invalid")
      ).to.be.revertedWith("JumpAccessControl: zero address");
    });

    it("Should not allow duplicate registration", async function () {
      await accessControl.registerContract(contract1.address, "MockContract1");
      await expect(
        accessControl.registerContract(contract1.address, "MockContract1")
      ).to.be.revertedWith("JumpAccessControl: already registered");
    });

    it("Should unregister a contract", async function () {
      await accessControl.registerContract(contract1.address, "MockContract1");
      await accessControl.unregisterContract(contract1.address);
      expect(await accessControl.registeredContracts(contract1.address)).to.be.false;
    });
  });

  describe("Role Management", function () {
    beforeEach(async function () {
      await accessControl.registerContract(contract1.address, "MockContract1");
      await accessControl.registerContract(contract2.address, "MockContract2");
    });

    it("Should grant role to contract", async function () {
      await accessControl.grantRoleToContract(contract1.address, await accessControl.MINTER_ROLE());
      expect(await accessControl.hasRole(await accessControl.MINTER_ROLE(), contract1.address)).to.be.true;
    });

    it("Should revoke role from contract", async function () {
      await accessControl.grantRoleToContract(contract1.address, await accessControl.MINTER_ROLE());
      await accessControl.revokeRoleFromContract(contract1.address, await accessControl.MINTER_ROLE());
      expect(await accessControl.hasRole(await accessControl.MINTER_ROLE(), contract1.address)).to.be.false;
    });

    it("Should get role members", async function () {
      await accessControl.grantRoleToContract(contract1.address, await accessControl.MINTER_ROLE());
      await accessControl.grantRoleToContract(contract2.address, await accessControl.MINTER_ROLE());
      
      const members = await accessControl.getRoleMembers(await accessControl.MINTER_ROLE());
      expect(members.length).to.equal(2);
      expect(members).to.include(contract1.address);
      expect(members).to.include(contract2.address);
    });

    it("Should get role member count", async function () {
      await accessControl.grantRoleToContract(contract1.address, await accessControl.MINTER_ROLE());
      expect(await accessControl.getRoleMemberCount(await accessControl.MINTER_ROLE())).to.equal(1);
    });
  });

  describe("Batch Operations", function () {
    it("Should batch grant roles", async function () {
      await accessControl.registerContract(contract1.address, "MockContract1");
      await accessControl.registerContract(contract2.address, "MockContract2");
      
      await accessControl.batchGrantRole(
        [contract1.address, contract2.address],
        await accessControl.MINTER_ROLE()
      );
      
      expect(await accessControl.hasRole(await accessControl.MINTER_ROLE(), contract1.address)).to.be.true;
      expect(await accessControl.hasRole(await accessControl.MINTER_ROLE(), contract2.address)).to.be.true;
    });

    it("Should batch revoke roles", async function () {
      await accessControl.registerContract(contract1.address, "MockContract1");
      await accessControl.registerContract(contract2.address, "MockContract2");
      
      await accessControl.batchGrantRole(
        [contract1.address, contract2.address],
        await accessControl.MINTER_ROLE()
      );
      
      await accessControl.batchRevokeRole(
        [contract1.address, contract2.address],
        await accessControl.MINTER_ROLE()
      );
      
      expect(await accessControl.hasRole(await accessControl.MINTER_ROLE(), contract1.address)).to.be.false;
      expect(await accessControl.hasRole(await accessControl.MINTER_ROLE(), contract2.address)).to.be.false;
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause the contract", async function () {
      await accessControl.emergencyPause();
      expect(await accessControl.paused()).to.be.true;
    });

    it("Should unpause the contract", async function () {
      await accessControl.emergencyPause();
      await accessControl.emergencyUnpause();
      expect(await accessControl.paused()).to.be.false;
    });

    it("Should not allow non-pauser to pause", async function () {
      await expect(
        accessControl.connect(user).emergencyPause()
      ).to.be.revertedWithCustomError(accessControl, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Role Queries", function () {
    it("Should check role membership", async function () {
      await accessControl.grantRole(await accessControl.MINTER_ROLE(), minter.address);
      expect(await accessControl.hasRoleCheck(minter.address, await accessControl.MINTER_ROLE())).to.be.true;
      expect(await accessControl.hasRoleCheck(user.address, await accessControl.MINTER_ROLE())).to.be.false;
    });
  });
});

