const hre = require("hardhat");

async function main() {
  console.log("=== Deployment Summary ===\n");
  
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
    const network = hre.network.name;
    
    console.log(`Network: ${network}`);
    console.log(`Deployer: ${deployer.address}\n`);
    
    console.log("=== Contract Addresses ===");
    console.log(`JumpToken: ${JUMP_TOKEN}`);
    console.log(`JumpAchievements: ${JUMP_ACHIEVEMENTS}`);
    console.log(`JumpTierSystem: ${JUMP_TIER_SYSTEM}`);
    console.log(`JumpGameController: ${GAME_CONTROLLER}\n`);
    
    // Get contract info
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    
    const totalSupply = await jumpToken.totalSupply();
    const totalPlayers = await gameController.totalPlayers();
    const tierCount = await tierSystem.tierCount();
    
    console.log("=== System Status ===");
    console.log(`Total Token Supply: ${hre.ethers.formatEther(totalSupply)} JUMP`);
    console.log(`Total Players: ${totalPlayers}`);
    console.log(`Tiers Configured: ${tierCount}\n`);
    
    // Check if verified
    if (network !== "hardhat" && network !== "localhost") {
      console.log("=== Verification ===");
      console.log("Run: node scripts/verify-all.js to verify contracts");
    }
    
    console.log("\n✓ Summary complete!");
  } catch (error) {
    console.error("Error generating summary:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

