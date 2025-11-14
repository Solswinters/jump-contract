const hre = require("hardhat");

async function main() {
  const score = process.argv[2];
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  
  if (!score) {
    console.error("Error: Score required");
    console.log("Usage: node scripts/get-tier-info.js <score>");
    process.exit(1);
  }
  
  if (!JUMP_TIER_SYSTEM) {
    console.error("Error: JUMP_TIER_SYSTEM_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    
    const tier = await tierSystem.getTierForScore(score);
    const tokenReward = await tierSystem.getTokenReward(score);
    const achievementId = await tierSystem.getAchievementId(score);
    
    console.log(`\n=== Tier Information for Score ${score} ===\n`);
    console.log(`Tier Level: ${tier}`);
    console.log(`Token Reward: ${hre.ethers.formatEther(tokenReward)} JUMP`);
    console.log(`Achievement ID: ${achievementId === 0 ? "None" : achievementId}`);
    
    if (tier > 0) {
      const tierData = await tierSystem.tiers(tier);
      console.log(`\n=== Tier ${tier} Details ===`);
      console.log(`Score Range: ${tierData.minScore} - ${tierData.maxScore === hre.ethers.MaxUint256 ? "∞" : tierData.maxScore.toString()}`);
      console.log(`Token Reward: ${hre.ethers.formatEther(tierData.tokenReward)} JUMP`);
      console.log(`Achievement ID: ${tierData.achievementId === 0 ? "None" : tierData.achievementId.toString()}`);
    }
    
    console.log("\n✓ Tier information retrieved!");
  } catch (error) {
    console.error("Error getting tier info:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

