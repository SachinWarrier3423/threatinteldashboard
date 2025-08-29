const axios = require('axios');
const KEY = process.env.ABUSEIPDB_KEY;
if (!KEY) console.warn('Warning: ABUSEIPDB_KEY not set in .env');

async function abuseIpLookup(ip) {
  const resp = await axios.get('https://api.abuseipdb.com/api/v2/check', {
    params: { ipAddress: ip, maxAgeInDays: 90 },
    headers: { Key: KEY, Accept: 'application/json' }
  });
  return resp.data;
}

module.exports = { abuseIpLookup };
