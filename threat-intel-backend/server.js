/* server.js */
'use strict';

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

require('dotenv').config();

const app = express();

// ---------- Config ----------
const PORT = process.env.PORT || 8080;
const CORS_ALLOW = (process.env.CORS_ALLOW || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Allow your Lovable preview domain + localhost by default
const defaultAllowed = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://preview--threatinteldashboard.lovable.app'
];

const allowlist = new Set([...defaultAllowed, ...CORS_ALLOW]);

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools (no origin) & allowlisted domains
    if (!origin || allowlist.has(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: false
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '256kb' }));
app.use(morgan('tiny'));

// rate limit: per-IP 120 reqs/5min
app.use('/api/', rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
}));

// in-memory cache (TTL 3 minutes; adjust as you like)
const cache = new NodeCache({ stdTTL: 180, checkperiod: 60 });

// ---------- Helpers ----------
const isIP = (val) =>
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(val);

const isDomain = (val) =>
  /^(?!-)([a-zA-Z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/.test(val);

const isSha256 = (val) => /^[a-fA-F0-9]{64}$/.test(val);

const safeGet = async (key, fn) => {
  const hit = cache.get(key);
  if (hit) return hit;
  const fresh = await fn();
  cache.set(key, fresh);
  return fresh;
};

const toClient = (ok, data, meta = {}) => ({ ok, data, meta });

// Axios instances
const http = axios.create({ timeout: 15000 });

// ---------- Integrations ----------
// 1) VirusTotal v3: header x-apikey
const vt = {
  key: process.env.VIRUSTOTAL_API_KEY,
  base: 'https://www.virustotal.com/api/v3'
};
const vtHeaders = vt.key ? { 'x-apikey': vt.key } : {};

// 2) AbuseIPDB v2: header Key + Accept
const abuse = {
  key: process.env.ABUSEIPDB_API_KEY,
  base: 'https://api.abuseipdb.com/api/v2',
  maxAgeInDays: process.env.ABUSEIPDB_MAX_AGE || '90'
};
const abuseHeaders = abuse.key ? { Key: abuse.key, Accept: 'application/json' } : {};

// 3) AlienVault OTX: header X-OTX-API-KEY
const otx = {
  key: process.env.OTX_API_KEY,
  base: 'https://otx.alienvault.com/api/v1'
};
const otxHeaders = otx.key ? { 'X-OTX-API-KEY': otx.key } : {};

// 4) Shodan: ?key=
const shodan = {
  key: process.env.SHODAN_API_KEY,
  base: 'https://api.shodan.io'
};

// ---------- Routes ----------
// Health
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), ts: new Date().toISOString() });
});

// ---- VirusTotal ----
app.get('/api/virustotal/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  if (!isIP(ip)) return res.status(400).json(toClient(false, 'Invalid IP'));
  if (!vt.key) return res.status(501).json(toClient(false, 'VirusTotal key not configured'));
  try {
    const data = await safeGet(`vt_ip_${ip}`, async () => {
      const r = await http.get(`${vt.base}/ip_addresses/${ip}`, { headers: vtHeaders });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

app.get('/api/virustotal/domain/:domain', async (req, res) => {
  const { domain } = req.params;
  if (!isDomain(domain)) return res.status(400).json(toClient(false, 'Invalid domain'));
  if (!vt.key) return res.status(501).json(toClient(false, 'VirusTotal key not configured'));
  try {
    const data = await safeGet(`vt_domain_${domain}`, async () => {
      const r = await http.get(`${vt.base}/domains/${domain}`, { headers: vtHeaders });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

app.get('/api/virustotal/hash/:sha256', async (req, res) => {
  const { sha256 } = req.params;
  if (!isSha256(sha256)) return res.status(400).json(toClient(false, 'Invalid SHA-256'));
  if (!vt.key) return res.status(501).json(toClient(false, 'VirusTotal key not configured'));
  try {
    const data = await safeGet(`vt_hash_${sha256}`, async () => {
      const r = await http.get(`${vt.base}/files/${sha256}`, { headers: vtHeaders });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

// ---- AbuseIPDB ----
app.get('/api/abuseipdb/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  if (!isIP(ip)) return res.status(400).json(toClient(false, 'Invalid IP'));
  if (!abuse.key) return res.status(501).json(toClient(false, 'AbuseIPDB key not configured'));
  try {
    const data = await safeGet(`abuse_ip_${ip}`, async () => {
      const r = await http.get(`${abuse.base}/check`, {
        headers: abuseHeaders,
        params: { ipAddress: ip, maxAgeInDays: abuse.maxAgeInDays, verbose: true }
      });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

// ---- AlienVault OTX ----
app.get('/api/otx/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  if (!isIP(ip)) return res.status(400).json(toClient(false, 'Invalid IP'));
  if (!otx.key) return res.status(501).json(toClient(false, 'OTX key not configured'));
  try {
    const data = await safeGet(`otx_ip_${ip}`, async () => {
      // "general" returns pulses, reputation, whois, etc.
      const r = await http.get(`${otx.base}/indicators/IPv4/${ip}/general`, { headers: otxHeaders });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

app.get('/api/otx/domain/:domain', async (req, res) => {
  const { domain } = req.params;
  if (!isDomain(domain)) return res.status(400).json(toClient(false, 'Invalid domain'));
  if (!otx.key) return res.status(501).json(toClient(false, 'OTX key not configured'));
  try {
    const data = await safeGet(`otx_domain_${domain}`, async () => {
      const r = await http.get(`${otx.base}/indicators/domain/${domain}/general`, { headers: otxHeaders });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

// ---- Shodan ----
app.get('/api/shodan/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  if (!isIP(ip)) return res.status(400).json(toClient(false, 'Invalid IP'));
  if (!shodan.key) return res.status(501).json(toClient(false, 'Shodan key not configured'));
  try {
    const data = await safeGet(`shodan_ip_${ip}`, async () => {
      const r = await http.get(`${shodan.base}/shodan/host/${ip}`, {
        params: { key: shodan.key }
      });
      return r.data;
    });
    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

// ---- Unified Summary ----
// GET /api/summary/ip/:ip
// Returns a normalized object combining VT, AbuseIPDB, OTX, Shodan
app.get('/api/summary/ip/:ip', async (req, res) => {
  const { ip } = req.params;
  if (!isIP(ip)) return res.status(400).json(toClient(false, 'Invalid IP'));

  try {
    const data = await safeGet(`summary_ip_${ip}`, async () => {
      const tasks = [];

      if (vt.key) tasks.push(http.get(`${vt.base}/ip_addresses/${ip}`, { headers: vtHeaders }).then(r => ({ vt: r.data })).catch(() => ({ vt: null })));
      if (abuse.key) tasks.push(http.get(`${abuse.base}/check`, { headers: abuseHeaders, params: { ipAddress: ip, maxAgeInDays: abuse.maxAgeInDays, verbose: true } }).then(r => ({ abuse: r.data })).catch(() => ({ abuse: null })));
      if (otx.key) tasks.push(http.get(`${otx.base}/indicators/IPv4/${ip}/general`, { headers: otxHeaders }).then(r => ({ otx: r.data })).catch(() => ({ otx: null })));
      if (shodan.key) tasks.push(http.get(`${shodan.base}/shodan/host/${ip}`, { params: { key: shodan.key } }).then(r => ({ shodan: r.data })).catch(() => ({ shodan: null })));

      const parts = await Promise.all(tasks);
      const bundle = parts.reduce((acc, cur) => Object.assign(acc, cur), {});

      // --- normalize a few handy fields for the UI ---
      const score = {
        vt_malicious: bundle?.vt?.data?.attributes?.last_analysis_stats?.malicious ?? null,
        abuse_confidence: bundle?.abuse?.data?.abuseConfidenceScore ?? null,
        otx_pulse_count: Array.isArray(bundle?.otx?.pulse_info?.pulses) ? bundle.otx.pulse_info.pulses.length : null,
        shodan_open_ports: Array.isArray(bundle?.shodan?.ports) ? bundle.shodan.ports : null
      };

      const meta = {
        asn: bundle?.shodan?.asn || bundle?.vt?.data?.attributes?.as_owner || null,
        country: bundle?.vt?.data?.attributes?.country || bundle?.shodan?.country_name || null,
        last_seen:
          bundle?.vt?.data?.attributes?.last_modification_date
            ? new Date(bundle.vt.data.attributes.last_modification_date * 1000).toISOString()
            : null
      };

      return { score, meta, raw: bundle };
    });

    res.json(toClient(true, data));
  } catch (e) {
    res.status(502).json(toClient(false, e.response?.data || e.message));
  }
});

// 404
app.use((req, res) => res.status(404).json(toClient(false, 'Not found')));

// start
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
