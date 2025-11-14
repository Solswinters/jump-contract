const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
  const JUMP_TIER_SYSTEM = process.env.JUMP_TIER_SYSTEM_ADDRESS;
  const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
  
  if (!JUMP_TOKEN || !JUMP_ACHIEVEMENTS || !JUMP_TIER_SYSTEM || !GAME_CONTROLLER) {
    console.error("Error: Contract addresses not provided");
    process.exit(1);
  }
  
  const [deployer] = await hre.ethers.getSigners();
  
  const addresses = {
    network: network,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      jumpToken: JUMP_TOKEN,
      jumpAchievements: JUMP_ACHIEVEMENTS,
      jumpTierSystem: JUMP_TIER_SYSTEM,
      jumpGameController: GAME_CONTROLLER
    }
  };
  
  const filePath = path.join(__dirname, "../deploy", `addresses-${network}.json`);
  
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
  
  console.log(`\n✓ Addresses saved to ${filePath}\n`);
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

