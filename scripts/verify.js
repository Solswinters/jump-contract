const hre = require("hardhat");

async function main() {
  console.log("Verifying contracts on Basescan...\n");
  
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS || !JUMP_TIER_SYSTEM || !GAME_CONTROLLER) {
    console.error("Error: Contract addresses not provided");
    process.exit(1);
  }
  
  try {
    // Verify JumpToken
    console.log("Verifying JumpToken...");
    await hre.run("verify:verify", {
      address: JUMP_TOKEN,
      constructorArguments: [],
    });
    console.log("✓ JumpToken verified\n");
    
    // Verify JumpAchievements
    console.log("Verifying JumpAchievements...");
    const baseURI = "https://api.jumpgame.io/achievements/";
    await hre.run("verify:verify", {
      address: JUMP_ACHIEVEMENTS,
      constructorArguments: [baseURI],
    });
    console.log("✓ JumpAchievements verified\n");
    
    // Verify JumpTierSystem
    console.log("Verifying JumpTierSystem...");
    await hre.run("verify:verify", {
      address: JUMP_TIER_SYSTEM,
      constructorArguments: [],
    });
    console.log("✓ JumpTierSystem verified\n");
    
    // Verify JumpGameController
    console.log("Verifying JumpGameController...");
    await hre.run("verify:verify", {
      address: GAME_CONTROLLER,
      constructorArguments: [JUMP_TOKEN, JUMP_ACHIEVEMENTS, JUMP_TIER_SYSTEM],
    });
    console.log("✓ JumpGameController verified\n");
    
    console.log("All contracts verified successfully!");
  } catch (error) {
    console.error("Verification error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

