const fs = require('fs');

const diffData = fs.readFileSync('diff.txt', 'utf8');
const lines = diffData.split('\n').filter(Boolean);

const onlyMain = [];
const onlyFrontendApp = [];
const different = [];

for (const line of lines) {
  const [status, ...pathParts] = line.split('\t');
  const path = pathParts.join('\t');
  
  if (status === 'D') {
    onlyMain.push(path);
  } else if (status === 'A') {
    onlyFrontendApp.push(path);
  } else if (status === 'M' || status.startsWith('R')) {
    different.push(path);
  } else {
    // Other statuses like C, U, etc.
    different.push(path);
  }
}

let report = `# Branch Comparison Report: main vs frontend-app

## Files Only in \`main\` (Deleted in \`frontend-app\`)
${onlyMain.length > 0 ? onlyMain.map(p => '- ' + p).join('\n') : 'None'}

## Files Only in \`frontend-app\` (Added in \`frontend-app\`)
${onlyFrontendApp.length > 0 ? onlyFrontendApp.map(p => '- ' + p).join('\n') : 'None'}

## Files That Differ Between Branches (Modified)
${different.length > 0 ? different.map(p => '- ' + p).join('\n') : 'None'}

## Migration Analysis
Based on the diff, \`frontend-app\` contains a complete React/Vite migration (\`Frontend/\`) with its own structural changes, whereas \`main\` contains the older HTML/PHP files and a \`nextjs-app\` folder which appears to have been removed in \`frontend-app\`.

**Does frontend-app contain newer code?**
Yes. The \`frontend-app\` branch contains a new React SPA implementation (inside the \`Frontend/\` directory) that is not present in \`main\`. It also has recent feature commits (e.g., dynamic test kits catalog, WhatsApp redirects).

**Safe Migration Plan:**
1. **Preserve Legacy Assets**: Ensure any legacy PHP/HTML files required for fallback are safely backed up or kept in a \`legacy/\` folder on \`main\`.
2. **Merge Strategy**: Instead of a blind merge (which would delete the legacy files and cause conflicts), we can checkout the \`Frontend\` folder from \`frontend-app\` into \`main\` as a sub-directory, or carefully merge allowing both architectures to coexist during testing.
3. **Resolve Configs**: Merge \`vercel.json\` and \`package.json\` selectively so the build step directs to the new React app without breaking existing serverless functions.
`;

fs.writeFileSync('C:\\Users\\MSI\\.gemini\\antigravity-ide\\brain\\36467db7-cb78-4bf6-9a1e-35f8543482a9\\branch_comparison_report.md', report);
console.log('Report generated successfully.');
