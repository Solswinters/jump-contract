const hre = require("hardhat");

async function main() {
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  
  if (!JUMP_TIER_SYSTEM) {
    console.error("Error: JUMP_TIER_SYSTEM_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    
    const tierCount = await tierSystem.tierCount();
    console.log(`\nTotal Tiers: ${tierCount}\n`);
    console.log("=== Tier Configuration ===\n");
    
    for (let i = 1; i <= tierCount; i++) {
      const tier = await tierSystem.tiers(i);
      
      if (tier.exists) {
        console.log(`Tier ${i}:`);
        console.log(`  Score Range: ${tier.minScore} - ${tier.maxScore === hre.ethers.MaxUint256 ? "∞" : tier.maxScore.toString()}`);
        console.log(`  Token Reward: ${hre.ethers.formatEther(tier.tokenReward)} JUMP`);
        console.log(`  Achievement ID: ${tier.achievementId.toString()}`);
        console.log("");
      }
    }
    
    console.log("✓ Tier listing completed!");
  } catch (error) {
    console.error("Error listing tiers:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

