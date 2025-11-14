const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const filePath = path.join(__dirname, "../deploy", `addresses-${network}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: Address file not found: ${filePath}`);
    console.log("Run deployment first or create addresses file manually");
    process.exit(1);
  }
  
  const addresses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  console.log(`\n=== Contract Addresses for ${network} ===\n`);
  console.log(`Deployed At: ${addresses.deployedAt}`);
  console.log(`Deployer: ${addresses.deployer}\n`);
  console.log("Contracts:");
  console.log(`  JumpToken: ${addresses.contracts.jumpToken}`);
  console.log(`  JumpAchievements: ${addresses.contracts.jumpAchievements}`);
  console.log(`  JumpTierSystem: ${addresses.contracts.jumpTierSystem}`);
  console.log(`  JumpGameController: ${addresses.contracts.jumpGameController}\n`);
  
  // Export to environment
  console.log("=== Environment Variables ===\n");
  console.log(`export JUMP_TOKEN_ADDRESS=${addresses.contracts.jumpToken}`);
  console.log(`export JUMP_ACHIEVEMENTS_ADDRESS=${addresses.contracts.jumpAchievements}`);
  console.log(`export JUMP_TIER_SYSTEM_ADDRESS=${addresses.contracts.jumpTierSystem}`);
  console.log(`export GAME_CONTROLLER_ADDRESS=${addresses.contracts.jumpGameController}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

