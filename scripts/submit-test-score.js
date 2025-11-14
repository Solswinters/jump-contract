const hre = require("hardhat");

async function main() {
  const playerAddress = process.argv[2];
  const score = process.argv[3];
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!playerAddress || !score) {
    console.error("Error: Player address and score required");
    console.log("Usage: node scripts/submit-test-score.js <player_address> <score>");
    process.exit(1);
  }
  
  if (!GAME_CONTROLLER) {
    console.error("Error: GAME_CONTROLLER_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    
    console.log(`\nSubmitting score for player: ${playerAddress}`);
    console.log(`Score: ${score}\n`);
    
    const tx = await gameController.submitScore(playerAddress, score);
    console.log("Transaction hash:", tx.hash);
    
    await tx.wait();
    console.log("✓ Score submitted successfully!");
    
    // Get updated stats
    const [highestScore, highestTier, totalRewards] = await gameController.getPlayerStats(playerAddress);
    console.log(`\nUpdated Stats:`);
    console.log(`Highest Score: ${highestScore.toString()}`);
    console.log(`Highest Tier: ${highestTier.toString()}`);
    console.log(`Total Rewards: ${hre.ethers.formatEther(totalRewards)} JUMP`);
  } catch (error) {
    console.error("Error submitting score:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

