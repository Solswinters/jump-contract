const hre = require("hardhat");

async function main() {
  console.log("Testing contract connectivity...\n");
  
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS || !JUMP_TIER_SYSTEM || !GAME_CONTROLLER) {
    console.error("Error: Contract addresses not provided");
    process.exit(1);
  }
  
  try {
    // Test JumpToken
    console.log("Testing JumpToken...");
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    const tokenName = await jumpToken.name();
    console.log(`✓ Connected: ${tokenName}\n`);
    
    // Test JumpAchievements
    console.log("Testing JumpAchievements...");
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    const achName = await jumpAchievements.name();
    console.log(`✓ Connected: ${achName}\n`);
    
    // Test JumpTierSystem
    console.log("Testing JumpTierSystem...");
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    const tierCount = await tierSystem.tierCount();
    console.log(`✓ Connected: ${tierCount} tiers configured\n`);
    
    // Test JumpGameController
    console.log("Testing JumpGameController...");
    const gameController = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    const totalPlayers = await gameController.totalPlayers();
    console.log(`✓ Connected: ${totalPlayers} players registered\n`);
    
    // Test cross-contract references
    console.log("Testing cross-contract references...");
    const tokenAddress = await gameController.jumpToken();
    const achievementsAddress = await gameController.jumpAchievements();
    const tierSystemAddress = await gameController.tierSystem();
    
    if (tokenAddress === JUMP_TOKEN && 
        achievementsAddress === JUMP_ACHIEVEMENTS && 
        tierSystemAddress === JUMP_TIER_SYSTEM) {
      console.log("✓ All references valid\n");
    } else {
      console.log("⚠️  Reference mismatch detected\n");
    }
    
    console.log("✓ Connectivity test passed!");
  } catch (error) {
    console.error("Error testing connectivity:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

