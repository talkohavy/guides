# NPM Scripts

```json
{
  "scripts": {
    "clean": "rm -rf node_modules",
    "tsc": "tsc -p tsconfig.json",
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "format": "biome format src",
    "format:fix": "biome format --verbose ./src --write",
    "format:prettier": "prettier . --check --config .prettierrc.mjs --ignore-path .prettierignore",
    "test": "jest",
    "check": "npm run lint && npm run format:biome && npm run tsc && npm run test",
  }
}
```
