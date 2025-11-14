const hre = require("hardhat");

async function main() {
  const contractType = process.argv[2];
  const address = process.argv[3];
  
  if (!contractType || !address) {
    console.error("Error: Missing required parameters");
    console.log("Usage: node scripts/check-roles.js <contract_type> <address>");
    console.log("Contract types: token, achievements, controller");
    process.exit(1);
  }
  
  try {
    let contract;
    
    if (contractType === "token") {
      const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
      if (!JUMP_TOKEN) {
        console.error("Error: JUMP_TOKEN_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
      
      const MINTER_ROLE = await contract.MINTER_ROLE();
      const PAUSER_ROLE = await contract.PAUSER_ROLE();
      const ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      
      console.log(`\n=== Roles for ${address} on JumpToken ===\n`);
      console.log(`MINTER_ROLE: ${await contract.hasRole(MINTER_ROLE, address)}`);
      console.log(`PAUSER_ROLE: ${await contract.hasRole(PAUSER_ROLE, address)}`);
      console.log(`ADMIN_ROLE: ${await contract.hasRole(ADMIN_ROLE, address)}`);
    } else if (contractType === "achievements") {
      const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
      if (!JUMP_ACHIEVEMENTS) {
        console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
      
      const MINTER_ROLE = await contract.MINTER_ROLE();
      const PAUSER_ROLE = await contract.PAUSER_ROLE();
      const URI_SETTER_ROLE = await contract.URI_SETTER_ROLE();
      const ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      
      console.log(`\n=== Roles for ${address} on JumpAchievements ===\n`);
      console.log(`MINTER_ROLE: ${await contract.hasRole(MINTER_ROLE, address)}`);
      console.log(`PAUSER_ROLE: ${await contract.hasRole(PAUSER_ROLE, address)}`);
      console.log(`URI_SETTER_ROLE: ${await contract.hasRole(URI_SETTER_ROLE, address)}`);
      console.log(`ADMIN_ROLE: ${await contract.hasRole(ADMIN_ROLE, address)}`);
    } else if (contractType === "controller") {
      const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
      if (!GAME_CONTROLLER) {
        console.error("Error: GAME_CONTROLLER_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
      
      const OPERATOR_ROLE = await contract.GAME_OPERATOR_ROLE();
      const ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      
      console.log(`\n=== Roles for ${address} on JumpGameController ===\n`);
      console.log(`GAME_OPERATOR_ROLE: ${await contract.hasRole(OPERATOR_ROLE, address)}`);
      console.log(`ADMIN_ROLE: ${await contract.hasRole(ADMIN_ROLE, address)}`);
    } else {
      console.error("Invalid contract type");
      process.exit(1);
    }
    
    console.log("\n✓ Role check completed!");
  } catch (error) {
    console.error("Error checking roles:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

