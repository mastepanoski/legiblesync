#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to parse a sync file and extract sync rules
function parseSyncFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Simple regex to extract the array
  const match = content.match(/export const \w+Syncs: SyncRule\[\] = (\[[\s\S]*?\]);/);
  if (!match) return null;
  let code = match[1];
  // Remove TypeScript type assertions and type annotations
  code = code.replace(/\s+as\s+\w+(\[\])?/g, '');
  code = code.replace(/:\s*Query/g, '');
  code = code.replace(/:\s*Invocation\[\]/g, '');
  try {
    // This is dangerous, but for internal use
    const syncs = eval(code);
    return syncs;
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e.message);
    return null;
  }
}

// Function to generate markdown for a sync rule
function generateSyncMarkdown(sync) {
  let md = `## ${sync.name}\n\n`;
  if (sync.when && sync.when.length > 0) {
    md += `**When:**\n`;
    sync.when.forEach(w => {
      md += `- ${w.concept}/${w.action}`;
      if (w.input) md += ` with input: ${JSON.stringify(w.input, null, 2)}`;
      if (w.output) md += ` outputs: ${JSON.stringify(w.output, null, 2)}`;
      md += '\n';
    });
  }
  if (sync.where) {
    md += `**Where:** ${JSON.stringify(sync.where, null, 2)}\n\n`;
  }
  if (sync.then && sync.then.length > 0) {
    md += `**Then:**\n`;
    sync.then.forEach(t => {
      md += `- ${t.concept}/${t.action}`;
      if (t.input) md += ` with input: ${JSON.stringify(t.input, null, 2)}`;
      md += '\n';
    });
  }
  md += '\n---\n\n';
  return md;
}

// Main function
function main() {
  const syncFiles = [
    // List of sync files from glob
    'packages/example-console/src/syncs/article.sync.ts',
    'packages/example-console/src/syncs/comment.sync.ts',
    'packages/example-console/src/syncs/favorite.sync.ts',
    'packages/example-console/src/syncs/persistence.sync.ts',
    'packages/example-console/src/syncs/registration.sync.ts',
    'packages/example-express/src/syncs/article.sync.ts',
    'packages/example-express/src/syncs/comment.sync.ts',
    'packages/example-express/src/syncs/favorite.sync.ts',
    'packages/example-express/src/syncs/registration.sync.ts',
    'packages/example-nextjs-sse/src/syncs/comment.sync.ts',
    'packages/example-nextjs-sse/src/syncs/logging.sync.ts',
    'packages/example-eda/src/plugins/analytics/syncs/analytics-events.sync.ts',
    'packages/example-eda/src/plugins/orders/syncs/order-workflow.sync.ts',
    'packages/example-eda/src/plugins/payments/syncs/payment-workflow.sync.ts',
    'packages/example-eda/src/plugins/products/syncs/product-events.sync.ts',
    'packages/example-eda/src/plugins/users/syncs/user-events.sync.ts'
  ];

  let docs = '# LegibleSync Sync Rules Documentation\n\n';

  syncFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const syncs = parseSyncFile(fullPath);
      if (syncs) {
        docs += `## ${file}\n\n`;
        syncs.forEach(sync => {
          docs += generateSyncMarkdown(sync);
        });
      }
    }
  });

  fs.writeFileSync('SYNC_DOCS.md', docs);
  console.log('Documentation generated in SYNC_DOCS.md');
}

if (require.main === module) {
  main();
}