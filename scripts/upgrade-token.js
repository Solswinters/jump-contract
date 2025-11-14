const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Upgrading JumpToken with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Proxy address (from previous deployment)
  const PROXY_ADDRESS = process.env.JUMP_TOKEN_PROXY || "0x...";
  
  if (PROXY_ADDRESS === "0x...") {
    console.error("Please set JUMP_TOKEN_PROXY in .env file");
    process.exit(1);
  }
  
  console.log("\nCurrent proxy address:", PROXY_ADDRESS);
  
  // Get current implementation
  const currentImpl = await upgrades.erc1967.getImplementationAddress(PROXY_ADDRESS);
  console.log("Current implementation:", currentImpl);
  
  // Deploy new implementation
  console.log("\nDeploying new implementation...");
  const JumpTokenUpgradeableV2 = await ethers.getContractFactory("JumpTokenUpgradeableV2");
  
  // Upgrade proxy
  console.log("Upgrading proxy...");
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, JumpTokenUpgradeableV2);
  await upgraded.waitForDeployment();
  
  // Get new implementation
  const newImpl = await upgrades.erc1967.getImplementationAddress(PROXY_ADDRESS);
  console.log("New implementation:", newImpl);
  
  // Initialize V2 if needed
  console.log("\nInitializing V2...");
  try {
    await upgraded.initializeV2();
    console.log("V2 initialized successfully");
  } catch (error) {
    if (error.message.includes("already initialized")) {
      console.log("V2 already initialized");
    } else {
      throw error;
    }
  }
  
  // Verify upgrade
  console.log("\nVerifying upgrade...");
  const tokenName = await upgraded.name();
  const tokenSymbol = await upgraded.symbol();
  console.log("Token name:", tokenName);
  console.log("Token symbol:", tokenSymbol);
  
  // Test new feature if available
  try {
    const newFeature = await upgraded.getNewFeature();
    console.log("New feature value:", newFeature.toString());
  } catch (error) {
    console.log("New feature not available yet");
  }
  
  console.log("\n✅ Upgrade complete!");
  console.log("\nNext steps:");
  console.log("1. Verify new implementation on Basescan");
  console.log("2. Test all functionality");
  console.log("3. Monitor contract activity");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

