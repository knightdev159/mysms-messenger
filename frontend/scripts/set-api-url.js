const fs = require('fs');
const path = require('path');

const apiUrl = process.env.NG_APP_API_URL || process.env.PUBLIC_API_URL || '/api/v1';
const isVercel = process.env.VERCEL === '1';

if (isVercel && apiUrl === '/api/v1') {
  console.error('');
  console.error('ERROR: NG_APP_API_URL is not set. Requests will go to the wrong server (405 on login).');
  console.error('In Vercel: Project Settings → Environment Variables → Add NG_APP_API_URL');
  console.error('');
  process.exit(1);
}

const outPath = path.join(__dirname, '../src/environments/environment.prod.ts');
const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl.replace(/'/g, "\\'")}',
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Written environment.prod.ts with apiUrl:', apiUrl);
