const hre = require("hardhat");

async function main() {
  const contractType = process.argv[2]; // "token", "achievements", or "controller"
  const action = process.argv[3]; // "pause" or "unpause"
  
  if (!contractType || !action) {
    console.error("Error: Missing required parameters");
    console.log("Usage: node scripts/pause-contract.js <contract_type> <action>");
    console.log("Contract types: token, achievements, controller");
    console.log("Actions: pause, unpause");
    process.exit(1);
  }
  
  if (action !== "pause" && action !== "unpause") {
    console.error("Error: Action must be 'pause' or 'unpause'");
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
    } else if (contractType === "achievements") {
      const JUMP_ACHIEVEMENTS = process.env.JUMP_ACHIEVEMENTS_ADDRESS;
      if (!JUMP_ACHIEVEMENTS) {
        console.error("Error: JUMP_ACHIEVEMENTS_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpAchievements", JUMP_ACHIEVEMENTS);
    } else if (contractType === "controller") {
      const GAME_CONTROLLER = process.env.GAME_CONTROLLER_ADDRESS;
      if (!GAME_CONTROLLER) {
        console.error("Error: GAME_CONTROLLER_ADDRESS not set");
        process.exit(1);
      }
      contract = await hre.ethers.getContractAt("JumpGameController", GAME_CONTROLLER);
    } else {
      console.error("Invalid contract type");
      process.exit(1);
    }
    
    console.log(`\n${action === "pause" ? "Pausing" : "Unpausing"} ${contractType} contract...\n`);
    
    const tx = action === "pause" 
      ? await contract.pause()
      : await contract.unpause();
    
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    
    const isPaused = await contract.paused();
    console.log(`✓ Contract is now ${isPaused ? "paused" : "unpaused"}`);
  } catch (error) {
    console.error(`Error ${action}ing contract:`, error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

