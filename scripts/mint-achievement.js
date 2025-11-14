const hre = require("hardhat");

async function main() {
  const address = process.argv[2];
  const achievementId = process.argv[3];
  const amount = process.argv[4] || 1;
  
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  
  if (!address || !achievementId) {
    console.error("Error: Address and achievement ID required");
    console.log("Usage: node scripts/mint-achievement.js <address> <achievement_id> [amount]");
    process.exit(1);
  }
  
  if (!JUMP_ACHIEVEMENTS) {
    console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    
    console.log(`\nMinting achievement ${achievementId} to ${address}...`);
    console.log(`Amount: ${amount}\n`);
    
    const tx = await jumpAchievements.mint(address, achievementId, amount, "0x");
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    
    const balance = await jumpAchievements.balanceOf(address, achievementId);
    console.log(`✓ Achievement minted! New balance: ${balance}`);
  } catch (error) {
    console.error("Error minting achievement:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

