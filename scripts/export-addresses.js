const fs = require("fs");
const path = require("path");

async function main() {
  const network = process.argv[2] || "localhost";
  const filePath = path.join(__dirname, "../deploy", `addresses-${network}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: Address file not found: ${filePath}`);
    process.exit(1);
  }
  
  const addresses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  console.log("\n=== Environment Variables ===\n");
  console.log(`export JUMP_TOKEN_ADDRESS=${addresses.contracts.jumpToken}`);
  console.log(`export JUMP_ACHIEVEMENTS_ADDRESS=${addresses.contracts.jumpAchievements}`);
  console.log(`export JUMP_TIER_SYSTEM_ADDRESS=${addresses.contracts.jumpTierSystem}`);
  console.log(`export GAME_CONTROLLER_ADDRESS=${addresses.contracts.jumpGameController}\n`);
  
  // Also create .env.local file
  const envContent = `JUMP_TOKEN_ADDRESS=${addresses.contracts.jumpToken}
JUMP_ACHIEVEMENTS_ADDRESS=${addresses.contracts.jumpAchievements}
JUMP_TIER_SYSTEM_ADDRESS=${addresses.contracts.jumpTierSystem}
GAME_CONTROLLER_ADDRESS=${addresses.contracts.jumpGameController}
`;
  
  const envPath = path.join(__dirname, "../.env.local");
  fs.writeFileSync(envPath, envContent);
  
  console.log(`✓ Environment variables exported to .env.local`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

