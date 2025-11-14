const hre = require("hardhat");

async function main() {
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  
  if (!JUMP_ACHIEVEMENTS) {
    console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    
    console.log("\n=== Achievement Registry ===\n");
    
    // Check common achievement IDs
    const achievementIds = [101, 102, 103, 104, 1, 2, 3, 4, 5];
    
    for (const id of achievementIds) {
      try {
        const achievement = await jumpAchievements.achievements(id);
        
        if (achievement.exists) {
          console.log(`ID: ${id}`);
          console.log(`  Name: ${achievement.name}`);
          console.log(`  Description: ${achievement.description}`);
          console.log(`  Category: ${achievement.category}`);
          console.log(`  Rarity: ${achievement.rarity}`);
          console.log(`  Transferable: ${achievement.transferable}`);
          console.log("");
        }
      } catch (error) {
        // Achievement doesn't exist, skip
      }
    }
    
    console.log("✓ Achievement listing completed!");
  } catch (error) {
    console.error("Error listing achievements:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

