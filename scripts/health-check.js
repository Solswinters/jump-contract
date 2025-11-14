const hre = require("hardhat");

async function main() {
  console.log("Performing contract health check...\n");
  
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS || !JUMP_TIER_SYSTEM || !GAME_CONTROLLER) {
    console.error("Error: Contract addresses not provided");
    process.exit(1);
  }
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    
    // Check JumpToken
    console.log("=== JumpToken ===");
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    const tokenPaused = await jumpToken.paused();
    const totalSupply = await jumpToken.totalSupply();
    const maxSupply = await jumpToken.MAX_SUPPLY();
    const supplyPercent = (Number(totalSupply) / Number(maxSupply)) * 100;
    
    console.log(`Status: ${tokenPaused ? "PAUSED ⚠️" : "Active ✓"}`);
    console.log(`Supply: ${hre.ethers.formatEther(totalSupply)} / ${hre.ethers.formatEther(maxSupply)} (${supplyPercent.toFixed(2)}%)`);
    
    // Check JumpAchievements
    console.log("\n=== JumpAchievements ===");
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    const achPaused = await jumpAchievements.paused();
    console.log(`Status: ${achPaused ? "PAUSED ⚠️" : "Active ✓"}`);
    
    // Check JumpTierSystem
    console.log("\n=== JumpTierSystem ===");
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    const tierCount = await tierSystem.tierCount();
    console.log(`Tiers Configured: ${tierCount} ✓`);
    
    // Check JumpGameController
    console.log("\n=== JumpGameController ===");
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    const controllerPaused = await gameController.paused();
    const totalPlayers = await gameController.totalPlayers();
    
    console.log(`Status: ${controllerPaused ? "PAUSED ⚠️" : "Active ✓"}`);
    console.log(`Total Players: ${totalPlayers}`);
    
    // Overall health
    console.log("\n=== Overall Health ===");
    const allActive = !tokenPaused && !achPaused && !controllerPaused;
    console.log(`System Status: ${allActive ? "HEALTHY ✓" : "ISSUES DETECTED ⚠️"}`);
    
    if (!allActive) {
      console.log("\n⚠️  One or more contracts are paused!");
    }
    
    console.log("\n✓ Health check completed!");
  } catch (error) {
    console.error("Error during health check:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

