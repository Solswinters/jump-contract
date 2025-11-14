const hre = require("hardhat");

async function main() {
  const address = process.argv[2];
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  
  if (!address) {
    console.error("Error: Address required");
    console.log("Usage: node scripts/check-balance.js <address>");
    process.exit(1);
  }
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS) {
    console.error("Error: Contract addresses not set");
    process.exit(1);
  }
  
  try {
    console.log(`\nChecking balances for: ${address}\n`);
    
    // Check JUMP token balance
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    const tokenBalance = await jumpToken.balanceOf(address);
    const tokenSymbol = await jumpToken.symbol();
    
    console.log("=== Token Balances ===");
    console.log(`${tokenSymbol}: ${hre.ethers.formatEther(tokenBalance)}`);
    
    // Check achievement balances
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    
    console.log("\n=== Achievement Balances ===");
    const achievementIds = [101, 102, 103, 104];
    
    for (const id of achievementIds) {
      const balance = await jumpAchievements.balanceOf(address, id);
      if (balance > 0) {
        const achievement = await jumpAchievements.achievements(id);
        console.log(`${achievement.name} (ID: ${id}): ${balance}`);
      }
    }
    
    console.log("\n✓ Balance check completed!");
  } catch (error) {
    console.error("Error checking balance:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

