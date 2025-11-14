const hre = require("hardhat");

async function main() {
  console.log("Setting up roles and permissions...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  // Get contract addresses from environment or command line
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS || !GAME_CONTROLLER) {
    console.error("Error: Contract addresses not provided");
    console.log("Please set JUMP_TOKEN_ADDRESS, JUMP_ACHIEVEMENTS_ADDRESS, and GAME_CONTROLLER_ADDRESS");
    process.exit(1);
  }
  
  // Get contract instances
  const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
  const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
  
  // Grant MINTER_ROLE to GameController on JumpToken
  console.log("Granting MINTER_ROLE to GameController on JumpToken...");
  const MINTER_ROLE = await jumpToken.MINTER_ROLE();
  let tx = await jumpToken.grantRole(MINTER_ROLE, GAME_CONTROLLER);
  await tx.wait();
  console.log("✓ MINTER_ROLE granted to GameController on JumpToken");
  
  // Grant MINTER_ROLE to GameController on JumpAchievements
  console.log("\nGranting MINTER_ROLE to GameController on JumpAchievements...");
  const MINTER_ROLE_ACH = await jumpAchievements.MINTER_ROLE();
  tx = await jumpAchievements.grantRole(MINTER_ROLE_ACH, GAME_CONTROLLER);
  await tx.wait();
  console.log("✓ MINTER_ROLE granted to GameController on JumpAchievements");
  
  console.log("\nRole setup completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

