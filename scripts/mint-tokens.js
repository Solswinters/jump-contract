const hre = require("hardhat");

async function main() {
  const address = process.argv[2];
  const amount = process.argv[3];
  
  const JUMP_TOKEN = process.env.JUMP_TOKEN_ADDRESS;
  
  if (!address || !amount) {
    console.error("Error: Address and amount required");
    console.log("Usage: node scripts/mint-tokens.js <address> <amount>");
    process.exit(1);
  }
  
  if (!JUMP_TOKEN) {
    console.error("Error: JUMP_TOKEN_ADDRESS not set");
    process.exit(1);
  }
  
  try {
    const jumpToken = await hre.ethers.getContractAt("JumpToken", JUMP_TOKEN);
    
    const amountWei = hre.ethers.parseEther(amount);
    
    console.log(`\nMinting ${amount} JUMP tokens to ${address}...\n`);
    
    const tx = await jumpToken.mint(address, amountWei);
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    
    const balance = await jumpToken.balanceOf(address);
    console.log(`✓ Tokens minted! New balance: ${hre.ethers.formatEther(balance)} JUMP`);
  } catch (error) {
    console.error("Error minting tokens:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

