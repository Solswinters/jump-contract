const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to", hre.network.name);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy contracts
  console.log("\n=== Deploying Contracts ===\n");
  
  // 1. Deploy JumpToken
  console.log("Deploying JumpToken...");
  const JumpToken = await hre.ethers.getContractFactory("JumpToken");
  const jumpToken = await JumpToken.deploy();
  await jumpToken.waitForDeployment();
  const jumpTokenAddress = await jumpToken.getAddress();
  console.log("JumpToken deployed to:", jumpTokenAddress);
  
  console.log("\nDeployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

