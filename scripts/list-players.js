const hre = require("hardhat");

async function main() {
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  const limit = parseInt(process.argv[2]) || 10;
  
  if (!GAME_CONTROLLER) {
    console.error("Error: GAME_CONTROLLER_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    
    const totalPlayers = await gameController.totalPlayers();
    console.log(`\nTotal Players: ${totalPlayers}\n`);
    
    if (totalPlayers === 0n) {
      console.log("No players registered yet.");
      return;
    }
    
    console.log("=== Player Statistics ===\n");
    
    // Note: This is a simplified version. In a real implementation,
    // you would need to track player addresses separately or use events
    // to get the list of players, as there's no built-in enumeration.
    
    console.log("Note: Player enumeration requires tracking addresses separately.");
    console.log("Use events or maintain a separate registry for full player listing.");
    console.log("\nTo get stats for a specific player, use:");
    console.log("node scripts/query-player.js <player_address>");
  } catch (error) {
    console.error("Error listing players:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

