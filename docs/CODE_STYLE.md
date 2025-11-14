# Code Style Guide

Coding standards and style guidelines for the Jump Token project.

## Solidity Style

### Naming Conventions

- **Contracts**: PascalCase (e.g., `JumpToken`)
- **Functions**: camelCase (e.g., `mintTokens`)
- **Variables**: camelCase (e.g., `totalSupply`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SUPPLY`)
- **Events**: PascalCase (e.g., `TokensMinted`)
- **Structs**: PascalCase (e.g., `PlayerData`)

### Function Visibility

Always specify visibility explicitly:
- `public` - Can be called externally and internally
- `external` - Can only be called externally
- `internal` - Can only be called internally
- `private` - Can only be called within the contract

### NatSpec Documentation

All public functions must have NatSpec comments:

```solidity
/**
 * @dev Mints tokens to a specified address
 * @param to The address that will receive the minted tokens
 * @param amount The amount of tokens to mint
 * Requirements:
 * - Caller must have MINTER_ROLE
 * - Contract must not be paused
 */
function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused {
    // Implementation
}
```

### Spacing and Indentation

- Use 4 spaces for indentation
- No tabs
- Blank lines between functions
- Blank lines between contract sections

### Imports

Order imports:
1. SPDX license identifier
2. pragma statement
3. OpenZeppelin imports
4. Local imports

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./JumpTierSystem.sol";
```

## JavaScript/TypeScript Style

### Naming

- **Files**: camelCase (e.g., `deploy.js`)
- **Functions**: camelCase (e.g., `deployContracts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SUPPLY`)
- **Classes**: PascalCase (e.g., `JumpTokenIntegration`)

### Formatting

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Trailing commas in objects/arrays

### Error Handling

Always handle errors:

```javascript
try {
  const tx = await contract.function();
  await tx.wait();
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
```

## Test Style

### Structure

```javascript
describe("Contract Name", function () {
  let contract;
  let owner, addr1, addr2;
  
  beforeEach(async function () {
    // Setup
  });
  
  describe("Feature", function () {
    it("Should do something", async function () {
      // Test
    });
  });
});
```

### Test Names

- Use descriptive names
- Start with "Should"
- Be specific about what is being tested

## Documentation Style

### Markdown

- Use proper heading hierarchy
- Use code blocks for code examples
- Include examples where helpful
- Keep documentation up to date

### Comments

- Explain why, not what
- Use clear, concise language
- Update comments when code changes

## Best Practices

1. **Be consistent** - Follow existing patterns
2. **Be clear** - Code should be self-documenting
3. **Be concise** - Don't over-comment obvious code
4. **Be complete** - Document all public functions
5. **Be current** - Keep documentation updated

## Tools

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Resources

- [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)

