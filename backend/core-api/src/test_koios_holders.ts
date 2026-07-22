async function test() {
  const policy = "10c1a6929b55a8c04253f8b55c890d920831c03b5bb7b14ffb9fbfc1";
  const nameHex = "001bc2804d554144444942";
  const KOIOS_BASE = "https://preprod.koios.rest/api/v1";

  const url = `${KOIOS_BASE}/asset_addresses?_asset_policy=${policy}&_asset_name=${nameHex}`;
  console.log("Fetching URL:", url);
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Koios response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
