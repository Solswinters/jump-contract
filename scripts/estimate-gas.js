const hre = require("hardhat");

async function main() {
  console.log("Estimating gas costs for contract deployment...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  // Estimate JumpToken
  console.log("Estimating JumpToken deployment...");
  const JumpToken = await hre.ethers.getContractFactory("JumpToken");
  const jumpTokenEstimate = await hre.ethers.provider.estimateGas(
    JumpToken.getDeployTransaction()
  );
  console.log(`JumpToken: ${jumpTokenEstimate.toString()} gas`);
  
  // Estimate JumpAchievements
  console.log("\nEstimating JumpAchievements deployment...");
  const JumpAchievements = await hre.ethers.getContractFactory("JumpAchievements");
  const baseURI = "https://api.jumpgame.io/achievements/";
  const achievementsEstimate = await hre.ethers.provider.estimateGas(
    JumpAchievements.getDeployTransaction(baseURI)
  );
  console.log(`JumpAchievements: ${achievementsEstimate.toString()} gas`);
  
  // Estimate JumpTierSystem
  console.log("\nEstimating JumpTierSystem deployment...");
  const JumpTierSystem = await hre.ethers.getContractFactory("JumpTierSystem");
  const tierSystemEstimate = await hre.ethers.provider.estimateGas(
    JumpTierSystem.getDeployTransaction()
  );
  console.log(`JumpTierSystem: ${tierSystemEstimate.toString()} gas`);
  
  // Estimate JumpGameController
  console.log("\nEstimating JumpGameController deployment...");
  const JumpGameController = await hre.ethers.getContractFactory("JumpGameController");
  // Use zero addresses for estimation
  const gameControllerEstimate = await hre.ethers.provider.estimateGas(
    JumpGameController.getDeployTransaction(
      hre.ethers.ZeroAddress,
      hre.ethers.ZeroAddress,
      hre.ethers.ZeroAddress
    )
  );
  console.log(`JumpGameController: ${gameControllerEstimate.toString()} gas`);
  
  const total = jumpTokenEstimate + achievementsEstimate + tierSystemEstimate + gameControllerEstimate;
  console.log(`\nTotal estimated gas: ${total.toString()}`);
  
  // Get gas price
  const gasPrice = await hre.ethers.provider.getFeeData();
  if (gasPrice.gasPrice) {
    const cost = total * gasPrice.gasPrice;
    console.log(`Estimated cost: ${hre.ethers.formatEther(cost)} ETH`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

