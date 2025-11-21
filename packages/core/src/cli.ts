#!/usr/bin/env node

import { readFileSync } from 'fs';
import { parseSyncDSL } from './parser';

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3 || args[0] !== 'sync' || args[1] !== 'validate') {
    console.error('Usage: legiblesync sync validate <file.sync>');
    process.exit(1);
  }

  const filePath = args[2];
  try {
    const content = readFileSync(filePath, 'utf8');
    const rules = parseSyncDSL(content);
    console.log(`Validated ${rules.length} sync rules in ${filePath}`);
    rules.forEach(rule => {
      console.log(`- ${rule.name}`);
    });
  } catch (error) {
    console.error(`Validation failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}