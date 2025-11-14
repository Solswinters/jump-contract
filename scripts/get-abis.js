const fs = require("fs");
const path = require("path");

async function main() {
  const contractName = process.argv[2];
  
  if (!contractName) {
    console.error("Error: Contract name required");
    console.log("Usage: node scripts/get-abis.js <contract_name>");
    console.log("Available contracts: JumpToken, JumpAchievements, JumpTierSystem, JumpGameController");
    process.exit(1);
  }
  
  const artifactsPath = path.join(__dirname, "../artifacts/contracts");
  const contractFile = `${contractName}.sol/${contractName}.json`;
  const fullPath = path.join(artifactsPath, contractFile);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: Contract artifact not found: ${fullPath}`);
    console.log("Run 'npm run compile' first");
    process.exit(1);
  }
  
  try {
    const artifact = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    
    console.log(`\n=== ABI for ${contractName} ===\n`);
    console.log(JSON.stringify(artifact.abi, null, 2));
    
    // Optionally save to file
    const outputPath = path.join(__dirname, "../abis", `${contractName}.json`);
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`\n✓ ABI saved to ${outputPath}`);
  } catch (error) {
    console.error("Error reading artifact:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

