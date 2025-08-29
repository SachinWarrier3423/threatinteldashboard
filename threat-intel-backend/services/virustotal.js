const axios = require('axios');
const VT_KEY = process.env.VT_API_KEY;
if (!VT_KEY) console.warn('Warning: VT_API_KEY not set in .env');

async function vtLookupIP(ip) {
  const url = `https://www.virustotal.com/api/v3/ip_addresses/${encodeURIComponent(ip)}`;
  const resp = await axios.get(url, { headers: { 'x-apikey': VT_KEY } });
  return resp.data;
}

async function vtLookupDomain(domain) {
  const url = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`;
  const resp = await axios.get(url, { headers: { 'x-apikey': VT_KEY } });
  return resp.data;
}

module.exports = { vtLookupIP, vtLookupDomain };
