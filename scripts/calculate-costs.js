const hre = require("hardhat");

async function main() {
  console.log("Calculating deployment costs...\n");
  
  const network = hre.network.name;
  console.log(`Network: ${network}\n`);
  
  // Get gas price
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  
  if (!gasPrice) {
    console.error("Error: Could not fetch gas price");
    process.exit(1);
  }
  
  console.log(`Gas Price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei\n`);
  
  // Estimated gas costs (from previous deployments)
  const estimates = {
    JumpToken: 1500000n,
    JumpAchievements: 2000000n,
    JumpTierSystem: 800000n,
    JumpGameController: 2500000n
  };
  
  console.log("=== Estimated Gas Costs ===\n");
  
  let totalGas = 0n;
  for (const [contract, gas] of Object.entries(estimates)) {
    const cost = gas * gasPrice;
    totalGas += gas;
    console.log(`${contract}:`);
    console.log(`  Gas: ${gas.toLocaleString()}`);
    console.log(`  Cost: ${hre.ethers.formatEther(cost)} ETH`);
    console.log("");
  }
  
  const totalCost = totalGas * gasPrice;
  console.log("=== Total ===");
  console.log(`Total Gas: ${totalGas.toLocaleString()}`);
  console.log(`Total Cost: ${hre.ethers.formatEther(totalCost)} ETH`);
  
  // If on Base, show USD estimate (rough)
  if (network.includes("base")) {
    const ethPrice = 2500; // Rough estimate, adjust as needed
    const usdCost = parseFloat(hre.ethers.formatEther(totalCost)) * ethPrice;
    console.log(`Estimated USD Cost: $${usdCost.toFixed(2)}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

