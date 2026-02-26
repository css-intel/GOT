const { execSync } = require('child_process');
const fs = require('fs');
try {
  const out = execSync(
    'npx netlify deploy --prod --no-build --dir=dist --functions=netlify/functions',
    { cwd: 'C:/Users/CSS/GOT', timeout: 180000, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }
  );
  fs.writeFileSync('C:/Users/CSS/GOT/deploy-result.txt', 'SUCCESS\n' + out);
  console.log('DEPLOY OK');
} catch(e) {
  fs.writeFileSync('C:/Users/CSS/GOT/deploy-result.txt', 'FAILED\n' + (e.stdout||'') + '\n' + (e.stderr||''));
  console.log('DEPLOY FAILED');
}
