const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy upgradeable JumpToken
  console.log("\nDeploying JumpTokenUpgradeable...");
  const JumpTokenUpgradeable = await ethers.getContractFactory("JumpTokenUpgradeable");
  const jumpToken = await upgrades.deployProxy(
    JumpTokenUpgradeable,
    [deployer.address],
    { initializer: "initialize" }
  );
  await jumpToken.waitForDeployment();
  const jumpTokenAddress = await jumpToken.getAddress();
  console.log("JumpTokenUpgradeable deployed to:", jumpTokenAddress);
  
  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(jumpTokenAddress);
  console.log("Implementation address:", implementationAddress);
  
  // Get admin address
  const adminAddress = await upgrades.erc1967.getAdminAddress(jumpTokenAddress);
  console.log("Admin address:", adminAddress);
  
  console.log("\n✅ Upgradeable deployment complete!");
  console.log("\nContract addresses:");
  console.log("JumpToken (Proxy):", jumpTokenAddress);
  console.log("JumpToken (Implementation):", implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

