import axios from "axios";

export const lookupHandler = async (req, res) => {
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ error: "Type and value are required" });
  }

  try {
    const virustotal = await axios.get(
      `https://www.virustotal.com/api/v3/ip_addresses/${value}`,
      {
        headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY }
      }
    );

    // TODO: Add Shodan, OTX, AbuseIPDB calls here
    
    res.json({
      type,
      value,
      providers: {
        virustotal: virustotal.data,
        shodan: null,
        otx: null,
        abuseipdb: null
      },
      errors: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lookup failed", details: err.message });
  }
};
