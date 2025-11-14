const hre = require("hardhat");

async function main() {
  const playerAddress = process.argv[2];
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!playerAddress) {
    console.error("Error: Player address required");
    console.log("Usage: node scripts/query-player.js <player_address>");
    process.exit(1);
  }
  
  if (!GAME_CONTROLLER) {
    console.error("Error: GAME_CONTROLLER_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    
    console.log(`\nQuerying player: ${playerAddress}\n`);
    
    const [highestScore, highestTier, totalRewards] = await gameController.getPlayerStats(playerAddress);
    
    console.log("=== Player Statistics ===");
    console.log(`Highest Score: ${highestScore.toString()}`);
    console.log(`Highest Tier: ${highestTier.toString()}`);
    console.log(`Total Rewards: ${hre.ethers.formatEther(totalRewards)} JUMP`);
    
    // Get tier system for more details
    const tierSystemAddress = await gameController.tierSystem();
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", tierSystemAddress);
    
    if (highestTier > 0) {
      const tier = await tierSystem.tiers(highestTier);
      console.log(`\n=== Tier ${highestTier} Details ===`);
      console.log(`Score Range: ${tier.minScore} - ${tier.maxScore}`);
      console.log(`Token Reward: ${hre.ethers.formatEther(tier.tokenReward)} JUMP`);
      console.log(`Achievement ID: ${tier.achievementId}`);
    }
    
    console.log("\n✓ Query completed!");
  } catch (error) {
    console.error("Error querying player:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

