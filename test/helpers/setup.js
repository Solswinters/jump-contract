const { ethers } = require("hardhat");

/**
 * Deploys all contracts and sets up the complete system
 * @returns {Object} Object containing all deployed contracts and signers
 */
async function deployContracts() {
  const [owner, gameOperator, player1, player2] = await ethers.getSigners();
  
  // Deploy JumpToken
  const JumpToken = await ethers.getContractFactory("JumpToken");
  const jumpToken = await JumpToken.deploy();
  await jumpToken.waitForDeployment();
  
  // Deploy JumpAchievements
  const JumpAchievements = await ethers.getContractFactory("JumpAchievements");
  const jumpAchievements = await JumpAchievements.deploy("https://test.uri/");
  await jumpAchievements.waitForDeployment();
  
  // Deploy JumpTierSystem
  const JumpTierSystem = await ethers.getContractFactory("JumpTierSystem");
  const tierSystem = await JumpTierSystem.deploy();
  await tierSystem.waitForDeployment();
  
  // Deploy JumpGameController
  const JumpGameController = await ethers.getContractFactory("JumpGameController");
  const gameController = await JumpGameController.deploy(
    await jumpToken.getAddress(),
    await jumpAchievements.getAddress(),
    await tierSystem.getAddress()
  );
  await gameController.waitForDeployment();
  
  // Setup roles
  const MINTER_ROLE = await jumpToken.MINTER_ROLE();
  await jumpToken.grantRole(MINTER_ROLE, await gameController.getAddress());
  
  const MINTER_ROLE_ACH = await jumpAchievements.MINTER_ROLE();
  await jumpAchievements.grantRole(MINTER_ROLE_ACH, await gameController.getAddress());
  
  const GAME_OPERATOR_ROLE = await gameController.GAME_OPERATOR_ROLE();
  await gameController.grantRole(GAME_OPERATOR_ROLE, gameOperator.address);
  
  // Create default achievements
  await jumpAchievements.createAchievement(101, "Bronze", "Bronze badge", 0, 0, false);
  await jumpAchievements.createAchievement(102, "Silver", "Silver badge", 0, 1, false);
  await jumpAchievements.createAchievement(103, "Gold", "Gold badge", 0, 2, false);
  await jumpAchievements.createAchievement(104, "Diamond", "Diamond badge", 0, 3, false);
  
  return {
    jumpToken,
    jumpAchievements,
    tierSystem,
    gameController,
    owner,
    gameOperator,
    player1,
    player2
  };
}

module.exports = {
  deployContracts
};

