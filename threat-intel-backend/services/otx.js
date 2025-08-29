const axios = require('axios');
const KEY = process.env.OTX_KEY;
if (!KEY) console.warn('Warning: OTX_KEY not set in .env');

async function otxLookupIP(ip) {
  const url = `https://otx.alienvault.com/api/v1/indicators/IPv4/${encodeURIComponent(ip)}/general`;
  const resp = await axios.get(url, { headers: { 'X-OTX-API-KEY': KEY } });
  return resp.data;
}

async function otxLookupDomain(domain) {
  const url = `https://otx.alienvault.com/api/v1/indicators/domain/${encodeURIComponent(domain)}/general`;
  const resp = await axios.get(url, { headers: { 'X-OTX-API-KEY': KEY } });
  return resp.data;
}

module.exports = { otxLookupIP, otxLookupDomain };
