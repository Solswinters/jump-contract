const hre = require("hardhat");

async function main() {
  console.log("Initializing default achievements...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  
  if (!JUMP_ACHIEVEMENTS) {
    console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not provided");
    process.exit(1);
  }
  
  const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
  
  // Define achievement badges for tiers
  const achievements = [
    {
      id: 101,
      name: "Bronze Champion",
      description: "Reached 100 points",
      category: 0, // Score Milestone
      rarity: 0, // Common
      transferable: false
    },
    {
      id: 102,
      name: "Silver Champion",
      description: "Reached 500 points",
      category: 0,
      rarity: 1, // Rare
      transferable: false
    },
    {
      id: 103,
      name: "Gold Champion",
      description: "Reached 1000 points",
      category: 0,
      rarity: 2, // Epic
      transferable: false
    },
    {
      id: 104,
      name: "Diamond Champion",
      description: "Reached 5000 points",
      category: 0,
      rarity: 3, // Legendary
      transferable: false
    }
  ];
  
  console.log("Creating achievement badges...\n");
  
  for (const achievement of achievements) {
    console.log(`Creating: ${achievement.name} (ID: ${achievement.id})`);
    const tx = await jumpAchievements.createAchievement(
      achievement.id,
      achievement.name,
      achievement.description,
      achievement.category,
      achievement.rarity,
      achievement.transferable
    );
    await tx.wait();
    console.log(`✓ ${achievement.name} created`);
  }
  
  console.log("\nAchievement initialization completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

