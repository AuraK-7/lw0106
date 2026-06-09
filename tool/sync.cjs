/**
 * sync.cjs — Gerrit → GitHub 同步脚本
 * 用法：npm run sync
 */
const { execSync } = require('child_process');

const SSH_OPTS = 'ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const out = execSync(cmd, {
      encoding: 'utf8',
      env: { ...process.env, GIT_SSH_COMMAND: SSH_OPTS },
      timeout: 30000,
    });
    console.log(out.trim());
    return true;
  } catch (e) {
    console.error(e.stderr || e.message);
    return false;
  }
}

// 1. Fetch from Gerrit
if (!run('git fetch gerrit master')) {
  console.error('❌ Fetch from Gerrit failed');
  process.exit(1);
}

// 2. Push to GitHub main
if (!run('git push github gerrit/master:main --force')) {
  console.error('❌ Push to GitHub failed');
  process.exit(1);
}

console.log('\n✅ Sync complete — Gerrit master → GitHub main');
