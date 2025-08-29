const axios = require('axios');
const KEY = process.env.SHODAN_KEY;
if (!KEY) console.warn('Warning: SHODAN_KEY not set in .env');

async function shodanLookupIP(ip) {
  // Shodan host endpoint. If it returns 404, we handle that upstream.
  const url = `https://api.shodan.io/shodan/host/${encodeURIComponent(ip)}?key=${KEY}`;
  const resp = await axios.get(url);
  return resp.data;
}

module.exports = { shodanLookupIP };
