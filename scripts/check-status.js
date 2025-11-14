const hre = require("hardhat");

async function main() {
  console.log("Checking contract status...\n");
  
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS || !JUMP_TIER_SYSTEM || !GAME_CONTROLLER) {
    console.error("Error: Contract addresses not provided");
    process.exit(1);
  }
  
  try {
    // Check JumpToken
    console.log("=== JumpToken ===");
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    const tokenName = await jumpToken.name();
    const tokenSymbol = await jumpToken.symbol();
    const totalSupply = await jumpToken.totalSupply();
    const maxSupply = await jumpToken.MAX_SUPPLY();
    const isPaused = await jumpToken.paused();
    
    console.log(`Name: ${tokenName}`);
    console.log(`Symbol: ${tokenSymbol}`);
    console.log(`Total Supply: ${hre.ethers.formatEther(totalSupply)} ${tokenSymbol}`);
    console.log(`Max Supply: ${hre.ethers.formatEther(maxSupply)} ${tokenSymbol}`);
    console.log(`Paused: ${isPaused}`);
    
    // Check JumpAchievements
    console.log("\n=== JumpAchievements ===");
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    const achName = await jumpAchievements.name();
    const achSymbol = await jumpAchievements.symbol();
    const achPaused = await jumpAchievements.paused();
    
    console.log(`Name: ${achName}`);
    console.log(`Symbol: ${achSymbol}`);
    console.log(`Paused: ${achPaused}`);
    
    // Check JumpTierSystem
    console.log("\n=== JumpTierSystem ===");
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    const tierCount = await tierSystem.tierCount();
    console.log(`Total Tiers: ${tierCount}`);
    
    // Check JumpGameController
    console.log("\n=== JumpGameController ===");
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    const totalPlayers = await gameController.totalPlayers();
    const controllerPaused = await gameController.paused();
    
    console.log(`Total Players: ${totalPlayers}`);
    console.log(`Paused: ${controllerPaused}`);
    
    console.log("\n✓ Status check completed!");
  } catch (error) {
    console.error("Error checking status:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

