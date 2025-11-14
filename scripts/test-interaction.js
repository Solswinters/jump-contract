const hre = require("hardhat");

async function main() {
  console.log("Testing contract interactions...\n");
  
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
    console.log("Using account:", deployer.address);
    
    // Get contract instances
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    
    console.log("\n=== Contract Information ===\n");
    
    // Token info
    const tokenName = await jumpToken.name();
    const tokenSymbol = await jumpToken.symbol();
    const totalSupply = await jumpToken.totalSupply();
    console.log(`Token: ${tokenName} (${tokenSymbol})`);
    console.log(`Total Supply: ${hre.ethers.formatEther(totalSupply)} ${tokenSymbol}`);
    
    // Tier info
    const tierCount = await tierSystem.tierCount();
    console.log(`\nTier System: ${tierCount} tiers configured`);
    
    // Game controller info
    const totalPlayers = await gameController.totalPlayers();
    const isPaused = await gameController.paused();
    console.log(`\nGame Controller:`);
    console.log(`  Total Players: ${totalPlayers}`);
    console.log(`  Paused: ${isPaused}`);
    
    // Test tier calculation
    console.log("\n=== Testing Tier Calculations ===\n");
    const testScores = [50, 150, 500, 1000, 5000];
    for (const score of testScores) {
      const tier = await tierSystem.getTierForScore(score);
      const reward = await tierSystem.getTokenReward(score);
      console.log(`Score ${score}: Tier ${tier}, Reward ${hre.ethers.formatEther(reward)} JUMP`);
    }
    
    console.log("\n✓ Interaction test completed!");
  } catch (error) {
    console.error("Error testing interactions:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

