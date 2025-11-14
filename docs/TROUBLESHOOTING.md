# Troubleshooting Guide

Common issues and solutions for the Jump Token contract system.

## Deployment Issues

### "Insufficient funds for gas"

**Problem:** Not enough ETH to pay for gas fees.

**Solution:**
- Check your account balance
- Ensure you have sufficient ETH for deployment
- Consider using a testnet first

### "Contract verification failed"

**Problem:** Contract verification on Basescan fails.

**Solution:**
- Verify constructor arguments match exactly
- Check network (testnet vs mainnet)
- Ensure Basescan API key is correct
- Try manual verification on Basescan

### "Role grant failed"

**Problem:** Cannot grant roles after deployment.

**Solution:**
- Verify you're using the deployer account
- Check contract addresses are correct
- Ensure contracts are deployed successfully
- Verify you have DEFAULT_ADMIN_ROLE

## Runtime Issues

### "Minting failed"

**Problem:** Cannot mint tokens.

**Solution:**
- Check if contract is paused
- Verify caller has MINTER_ROLE
- Check max supply limit
- Ensure recipient address is valid (not zero)

### "Score submission failed"

**Problem:** Cannot submit player scores.

**Solution:**
- Verify caller has GAME_OPERATOR_ROLE
- Check if GameController is paused
- Ensure player address is valid
- Verify score is within valid tier range

### "Achievement minting failed"

**Problem:** Cannot mint achievements.

**Solution:**
- Verify achievement exists (created first)
- Check if contract is paused
- Verify caller has MINTER_ROLE
- Ensure recipient address is valid

## Testing Issues

### "Tests failing locally"

**Problem:** Tests fail when running locally.

**Solution:**
- Run `npm install` to ensure dependencies
- Check Hardhat network is running
- Verify test accounts have sufficient balance
- Check for compilation errors

### "Gas estimation failed"

**Problem:** Cannot estimate gas for transactions.

**Solution:**
- Check network connectivity
- Verify contract addresses
- Ensure sufficient balance
- Check contract state (not paused)

## Configuration Issues

### "Environment variables not found"

**Problem:** Scripts fail due to missing env vars.

**Solution:**
- Create `.env` file from `env.example`
- Set all required variables
- Verify variable names match exactly
- Check for typos

### "Network connection failed"

**Problem:** Cannot connect to Base network.

**Solution:**
- Check RPC URL is correct
- Verify network is accessible
- Try alternative RPC endpoint
- Check internet connection

## Security Issues

### "Unauthorized access"

**Problem:** Getting access denied errors.

**Solution:**
- Verify account has required role
- Check role assignments
- Ensure using correct account
- Review access control setup

### "Transaction reverted"

**Problem:** Transactions revert without clear error.

**Solution:**
- Check contract state (paused/unpaused)
- Verify all requirements met
- Check gas limit
- Review contract logic

## Performance Issues

### "High gas costs"

**Problem:** Gas costs are unexpectedly high.

**Solution:**
- Use batch operations when possible
- Optimize transaction frequency
- Consider gas optimization techniques
- Review contract code

### "Slow transactions"

**Problem:** Transactions take too long.

**Solution:**
- Check network congestion
- Increase gas price
- Use faster network (testnet vs mainnet)
- Verify network status

## Getting Help

If you encounter issues not covered here:

1. Check the documentation
2. Review error messages carefully
3. Check GitHub issues
4. Open a new issue with details
5. Include error messages and steps to reproduce

## Common Error Messages

### "JumpToken: mint to zero address"
- **Cause:** Attempting to mint to address(0)
- **Fix:** Use a valid recipient address

### "JumpToken: max supply exceeded"
- **Cause:** Trying to mint beyond MAX_SUPPLY
- **Fix:** Check current supply before minting

### "JumpAchievements: achievement does not exist"
- **Cause:** Trying to mint non-existent achievement
- **Fix:** Create achievement first using createAchievement()

### "JumpGameController: invalid player address"
- **Cause:** Using zero address for player
- **Fix:** Use a valid player address

### "AccessControl: account is missing role"
- **Cause:** Account doesn't have required role
- **Fix:** Grant the required role to the account

