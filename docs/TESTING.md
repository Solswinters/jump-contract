# Testing Guide

Comprehensive guide for testing the Jump Token contract system.

## Test Structure

```
test/
├── helpers/          # Test utilities and setup
├── integration/      # Integration tests
├── edge-cases/       # Edge case tests
├── security/         # Security tests
├── operations/       # Operation tests
├── events/           # Event tests
├── achievements/     # Achievement-specific tests
└── tier/             # Tier system tests
```

## Running Tests

### All Tests

```bash
npm test
```

### Specific Test File

```bash
npx hardhat test test/JumpToken.test.js
```

### With Gas Reporting

```bash
REPORT_GAS=true npm test
```

### Test Coverage

```bash
npm run coverage
```

## Test Categories

### Unit Tests

Test individual contract functions in isolation.

**Example:**
```javascript
describe("JumpToken", function () {
  it("Should mint tokens", async function () {
    await jumpToken.mint(addr1.address, amount);
    expect(await jumpToken.balanceOf(addr1.address)).to.equal(amount);
  });
});
```

### Integration Tests

Test interactions between multiple contracts.

**Example:**
```javascript
describe("Full System Integration", function () {
  it("Should reward player for score", async function () {
    await gameController.submitScore(player, score);
    const balance = await jumpToken.balanceOf(player);
    expect(balance).to.be.gt(0);
  });
});
```

### Edge Case Tests

Test boundary conditions and unusual scenarios.

**Example:**
```javascript
describe("Edge Cases", function () {
  it("Should handle zero address", async function () {
    await expect(
      jumpToken.mint(ethers.ZeroAddress, amount)
    ).to.be.reverted;
  });
});
```

### Security Tests

Test security features and vulnerabilities.

**Example:**
```javascript
describe("Security", function () {
  it("Should prevent unauthorized minting", async function () {
    await expect(
      jumpToken.connect(unauthorized).mint(addr1.address, amount)
    ).to.be.reverted;
  });
});
```

## Test Helpers

### deployContracts()

Deploys all contracts and sets up the system.

```javascript
const { deployContracts } = require("./helpers/setup");
const contracts = await deployContracts();
```

## Writing Tests

### Test Structure

```javascript
describe("Contract Name", function () {
  let contract;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // Setup contracts
  });
  
  describe("Feature", function () {
    it("Should do something", async function () {
      // Test implementation
    });
  });
});
```

### Assertions

```javascript
// Equality
expect(value).to.equal(expected);

// Greater than
expect(value).to.be.gt(expected);

// Boolean
expect(value).to.be.true;
expect(value).to.be.false;

// Revert
await expect(transaction).to.be.reverted;
await expect(transaction).to.be.revertedWith("Error message");

// Events
await expect(transaction)
  .to.emit(contract, "EventName")
  .withArgs(arg1, arg2);
```

## Best Practices

1. **Test all functions**
2. **Test edge cases**
3. **Test error conditions**
4. **Test events**
5. **Test access control**
6. **Test state changes**
7. **Use descriptive test names**
8. **Keep tests independent**
9. **Clean up after tests**
10. **Test with realistic data**

## Common Test Patterns

### Testing Minting

```javascript
it("Should mint tokens", async function () {
  await token.mint(recipient, amount);
  expect(await token.balanceOf(recipient)).to.equal(amount);
  expect(await token.totalSupply()).to.equal(amount);
});
```

### Testing Access Control

```javascript
it("Should require role", async function () {
  await expect(
    contract.connect(unauthorized).restrictedFunction()
  ).to.be.reverted;
});
```

### Testing Events

```javascript
it("Should emit event", async function () {
  await expect(contract.function())
    .to.emit(contract, "EventName")
    .withArgs(expectedArg1, expectedArg2);
});
```

## Coverage Goals

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Continuous Testing

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Manual trigger

## Debugging Tests

### Using console.log

```javascript
console.log("Value:", value.toString());
```

### Using Hardhat Console

```bash
npx hardhat console
```

### Viewing Transaction Details

```javascript
const tx = await contract.function();
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
```

## Resources

- [Hardhat Testing](https://hardhat.org/docs/guides/test-contracts)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
- [Mocha Documentation](https://mochajs.org/)

