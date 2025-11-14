const hre = require("hardhat");

async function main() {
  const id = process.argv[2];
  const name = process.argv[3];
  const description = process.argv[4];
  const category = process.argv[5] || 0;
  const rarity = process.argv[6] || 0;
  const transferable = process.argv[7] === "true";
  
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  
  if (!id || !name || !description) {
    console.error("Error: Missing required parameters");
    console.log("Usage: node scripts/create-achievement.js <id> <name> <description> [category] [rarity] [transferable]");
    process.exit(1);
  }
  
  if (!JUMP_ACHIEVEMENTS) {
    console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const jumpAchievements = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    
    console.log(`\nCreating achievement...`);
    console.log(`ID: ${id}`);
    console.log(`Name: ${name}`);
    console.log(`Description: ${description}`);
    console.log(`Category: ${category}`);
    console.log(`Rarity: ${rarity}`);
    console.log(`Transferable: ${transferable}\n`);
    
    const tx = await jumpAchievements.createAchievement(
      id,
      name,
      description,
      category,
      rarity,
      transferable
    );
    
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("✓ Achievement created successfully!");
  } catch (error) {
    console.error("Error creating achievement:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

