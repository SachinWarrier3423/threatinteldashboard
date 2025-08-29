const { vtLookupIP, vtLookupDomain } = require('./virustotal.js');
const { abuseIpLookup } = require('./abuseipdb.js');
const { shodanLookupIP } = require('./shodan.js');
const { otxLookupIP, otxLookupDomain } = require('./otx.js');

/**
 * Returns object { type, value, providers: { virustotal:..., abuseipdb:..., shodan:..., otx:... }, errors: [...] }
 */
async function lookup(type, value) {
  const providers = {};
  const errors = [];

  // Build array of promises depending on type
  const tasks = [];

  // VirusTotal
  if (type === 'ip') tasks.push(
    vtLookupIP(value)
      .then(d => providers.virustotal = d)
      .catch(e => { errors.push({ provider: 'virustotal', error: (e.response?.data || e.message) }); })
  );
  if (type === 'domain') tasks.push(
    vtLookupDomain(value)
      .then(d => providers.virustotal = d)
      .catch(e => { errors.push({ provider: 'virustotal', error: (e.response?.data || e.message) }); })
  );

  // AbuseIPDB (only IP)
  if (type === 'ip') tasks.push(
    abuseIpLookup(value)
      .then(d => providers.abuseipdb = d)
      .catch(e => { errors.push({ provider: 'abuseipdb', error: (e.response?.data || e.message) }); })
  );

  // Shodan (only IP)
  if (type === 'ip') tasks.push(
    shodanLookupIP(value)
      .then(d => providers.shodan = d)
      .catch(e => { errors.push({ provider: 'shodan', error: (e.response?.data || e.message) }); })
  );

  // OTX
  if (type === 'ip') tasks.push(
    otxLookupIP(value)
      .then(d => providers.otx = d)
      .catch(e => { errors.push({ provider: 'otx', error: (e.response?.data || e.message) }); })
  );
  if (type === 'domain') tasks.push(
    otxLookupDomain(value)
      .then(d => providers.otx = d)
      .catch(e => { errors.push({ provider: 'otx', error: (e.response?.data || e.message) }); })
  );

  await Promise.all(tasks);

  return { type, value, providers, errors };
}

module.exports = { lookup };
