const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const anonKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="?([^"\n]+)"?/)[1];
const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY="?([^"\n]+)"?/)[1];

fetch('http://127.0.0.1:54321/api/pg-meta/default/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': serviceKey,
    'Authorization': 'Bearer ' + serviceKey
  },
  body: JSON.stringify({ query: `
    ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'applied';
    ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'screening';
    ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'interviewing';
    ALTER TYPE interest_status ADD VALUE IF NOT EXISTS 'offered';
  ` })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
});
