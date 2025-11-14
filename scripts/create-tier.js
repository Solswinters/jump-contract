const hre = require("hardhat");

async function main() {
  const tierLevel = process.argv[2];
  const minScore = process.argv[3];
  const maxScore = process.argv[4];
  const tokenReward = process.argv[5];
  const achievementId = process.argv[6] || 0;
  
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  
  if (!tierLevel || !minScore || !maxScore || !tokenReward) {
    console.error("Error: Missing required parameters");
    console.log("Usage: node scripts/create-tier.js <tier_level> <min_score> <max_score> <token_reward> [achievement_id]");
    process.exit(1);
  }
  
  if (!JUMP_TIER_SYSTEM) {
    console.error("Error: JUMP_TIER_SYSTEM_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const tierSystem = await hre.ethers.getContractAt("JumpTierSystem", JUMP_TIER_SYSTEM);
    
    const tokenRewardWei = hre.ethers.parseEther(tokenReward);
    
    // Handle max score (use MaxUint256 for unlimited)
    const maxScoreValue = maxScore === "unlimited" || maxScore === "max" 
      ? hre.ethers.MaxUint256 
      : BigInt(maxScore);
    
    console.log(`\nCreating Tier ${tierLevel}...`);
    console.log(`Min Score: ${minScore}`);
    console.log(`Max Score: ${maxScoreValue === hre.ethers.MaxUint256 ? "Unlimited" : maxScoreValue.toString()}`);
    console.log(`Token Reward: ${tokenReward} JUMP`);
    console.log(`Achievement ID: ${achievementId}\n`);
    
    const tx = await tierSystem.createTier(
      tierLevel,
      minScore,
      maxScoreValue,
      tokenRewardWei,
      achievementId
    );
    
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("✓ Tier created successfully!");
  } catch (error) {
    console.error("Error creating tier:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

