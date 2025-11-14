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
  
  // 2. Deploy JumpAchievements
  console.log("\nDeploying JumpAchievements...");
  const JumpAchievements = await hre.ethers.getContractFactory("JumpAchievements");
  const baseURI = "https://api.jumpgame.io/achievements/";
  const jumpAchievements = await JumpAchievements.deploy(baseURI);
  await jumpAchievements.waitForDeployment();
  const jumpAchievementsAddress = await jumpAchievements.getAddress();
  console.log("JumpAchievements deployed to:", jumpAchievementsAddress);
  
  // 3. Deploy JumpTierSystem
  console.log("\nDeploying JumpTierSystem...");
  const JumpTierSystem = await hre.ethers.getContractFactory("JumpTierSystem");
  const tierSystem = await JumpTierSystem.deploy();
  await tierSystem.waitForDeployment();
  const tierSystemAddress = await tierSystem.getAddress();
  console.log("JumpTierSystem deployed to:", tierSystemAddress);
  
  // 4. Deploy JumpGameController
  console.log("\nDeploying JumpGameController...");
  const JumpGameController = await hre.ethers.getContractFactory("JumpGameController");
  const gameController = await JumpGameController.deploy(
    jumpTokenAddress,
    jumpAchievementsAddress,
    tierSystemAddress
  );
  await gameController.waitForDeployment();
  const gameControllerAddress = await gameController.getAddress();
  console.log("JumpGameController deployed to:", gameControllerAddress);
  
  console.log("\n=== Deployment Summary ===");
  console.log("JumpToken:", jumpTokenAddress);
  console.log("JumpAchievements:", jumpAchievementsAddress);
  console.log("JumpTierSystem:", tierSystemAddress);
  console.log("JumpGameController:", gameControllerAddress);
  
  console.log("\nDeployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

