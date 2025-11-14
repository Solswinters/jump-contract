const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Checking contract versions and dependencies...\n");
  
  // Check package.json
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log("=== Package Versions ===\n");
  console.log(`Hardhat: ${packageJson.devDependencies.hardhat}`);
  console.log(`OpenZeppelin: ${packageJson.devDependencies["@openzeppelin/contracts"]}`);
  console.log(`Ethers: ${packageJson.devDependencies.ethers}`);
  
  // Check hardhat config
  const hardhatConfig = require(path.join(process.cwd(), "hardhat.config.js"));
  console.log(`\n=== Solidity Version ===\n`);
  console.log(`Version: ${hardhatConfig.solidity.version}`);
  console.log(`Optimizer: ${hardhatConfig.solidity.settings.optimizer.enabled ? "Enabled" : "Disabled"}`);
  if (hardhatConfig.solidity.settings.optimizer.enabled) {
    console.log(`Runs: ${hardhatConfig.solidity.settings.optimizer.runs}`);
  }
  
  // Check network
  console.log(`\n=== Network ===\n`);
  console.log(`Current Network: ${hre.network.name}`);
  
  if (hre.network.name !== "hardhat") {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Block Number: ${blockNumber}`);
    
    const feeData = await hre.ethers.provider.getFeeData();
    if (feeData.gasPrice) {
      console.log(`Gas Price: ${hre.ethers.formatUnits(feeData.gasPrice, "gwei")} gwei`);
    }
  }
  
  console.log("\n✓ Version check completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

