const hre = require("hardhat");

async function main() {
  const contractType = process.argv[2]; // "token", "achievements", or "controller"
  const roleType = process.argv[3]; // "minter", "pauser", "operator", "admin"
  const address = process.argv[4];
  
  if (!contractType || !roleType || !address) {
    console.error("Error: Missing required parameters");
    console.log("Usage: node scripts/grant-role.js <contract_type> <role_type> <address>");
    console.log("Contract types: token, achievements, controller");
    console.log("Role types: minter, pauser, operator, admin");
    process.exit(1);
  }
  
  try {
    let contract;
    let role;
    
    if (contractType === "token") {
      const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
      if (!JUMP_TOKEN) {
        console.error("Error: JUMP_TOKEN_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
      
      if (roleType === "minter") {
        role = await contract.MINTER_ROLE();
      } else if (roleType === "pauser") {
        role = await contract.PAUSER_ROLE();
      } else if (roleType === "admin") {
        role = await contract.DEFAULT_ADMIN_ROLE();
      } else {
        console.error("Invalid role type for token");
        process.exit(1);
      }
    } else if (contractType === "achievements") {
      const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
      if (!JUMP_ACHIEVEMENTS) {
        console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
      
      if (roleType === "minter") {
        role = await contract.MINTER_ROLE();
      } else if (roleType === "pauser") {
        role = await contract.PAUSER_ROLE();
      } else if (roleType === "admin") {
        role = await contract.DEFAULT_ADMIN_ROLE();
      } else {
        console.error("Invalid role type for achievements");
        process.exit(1);
      }
    } else if (contractType === "controller") {
      const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
      if (!GAME_CONTROLLER) {
        console.error("Error: GAME_CONTROLLER_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
      
      if (roleType === "operator") {
        role = await contract.GAME_OPERATOR_ROLE();
      } else if (roleType === "admin") {
        role = await contract.DEFAULT_ADMIN_ROLE();
      } else {
        console.error("Invalid role type for controller");
        process.exit(1);
      }
    } else {
      console.error("Invalid contract type");
      process.exit(1);
    }
    
    console.log(`\nGranting ${roleType} role to ${address}...\n`);
    
    const tx = await contract.grantRole(role, address);
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    
    console.log("✓ Role granted successfully!");
  } catch (error) {
    console.error("Error granting role:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

