const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying to Base Sepolia Testnet...");
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy JumpToken
  console.log("\n1. Deploying JumpToken...");
  const JumpToken = await ethers.getContractFactory("JumpToken");
  const jumpToken = await JumpToken.deploy();
  await jumpToken.waitForDeployment();
  const jumpTokenAddress = await jumpToken.getAddress();
  console.log("JumpToken deployed to:", jumpTokenAddress);
  
  // Deploy JumpAchievements
  console.log("\n2. Deploying JumpAchievements...");
  const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
  const jumpAchievements = await JumpAchievements.deploy();
  await jumpAchievements.waitForDeployment();
  const jumpAchievementsAddress = await jumpAchievements.getAddress();
  console.log("JumpAchievements deployed to:", jumpAchievementsAddress);
  
  // Deploy JumpTierSystem
  console.log("\n3. Deploying JumpTierSystem...");
  const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
  const tierSystem = await JumpTierSystem.deploy();
  await tierSystem.waitForDeployment();
  const tierSystemAddress = await tierSystem.getAddress();
  console.log("JumpTierSystem deployed to:", tierSystemAddress);
  
  // Deploy JumpGameController
  console.log("\n4. Deploying JumpGameController...");
  const JumpGameController = await ethers.getContractFactory("JumpGameController");
  const gameController = await JumpGameController.deploy(
    jumpTokenAddress,
    jumpAchievementsAddress,
    tierSystemAddress
  );
  await gameController.waitForDeployment();
  const gameControllerAddress = await gameController.getAddress();
  console.log("JumpGameController deployed to:", gameControllerAddress);
  
  // Setup roles
  console.log("\n5. Setting up roles...");
  const MINTER_ROLE = await jumpToken.MINTER_ROLE();
  await jumpToken.grantRole(MINTER_ROLE, gameControllerAddress);
  console.log("Granted MINTER_ROLE to JumpGameController");
  
  const ACHIEVEMENT_MINTER_ROLE = await jumpAchievements.MINTER_ROLE();
  await jumpAchievements.grantRole(ACHIEVEMENT_MINTER_ROLE, gameControllerAddress);
  console.log("Granted MINTER_ROLE to JumpGameController for achievements");
  
  console.log("\n✅ Deployment complete!");
  console.log("\nContract addresses on Base Sepolia:");
  console.log("JumpToken:", jumpTokenAddress);
  console.log("JumpAchievements:", jumpAchievementsAddress);
  console.log("JumpTierSystem:", tierSystemAddress);
  console.log("JumpGameController:", gameControllerAddress);
  
  console.log("\nNext steps:");
  console.log("1. Verify contracts on Basescan");
  console.log("2. Initialize achievements");
  console.log("3. Test score submission");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

