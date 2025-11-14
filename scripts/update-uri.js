const hre = require("hardhat");

async function main() {
  const newURI = process.argv[2];
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  
  if (!newURI) {
    console.error("Error: New URI required");
    console.log("Usage: node scripts/update-uri.js <new_uri>");
    console.log("Example: node scripts/update-uri.js https://api.example.com/achievements/");
    process.exit(1);
  }
  
  if (!JUMP_ACHIEVEMENTS) {
    console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    
    console.log(`\nUpdating URI to: ${newURI}\n`);
    
    const tx = await jumpAchievements.setURI(newURI);
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    
    // Verify URI was updated
    const uri = await jumpAchievements.uri(1);
    console.log(`✓ URI updated! Example URI for token ID 1: ${uri}`);
  } catch (error) {
    console.error("Error updating URI:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

