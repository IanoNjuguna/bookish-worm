async function test() {
  const url = "http://localhost:3000/api-backend/songs/1784280955851";
  console.log(`Fetching GET ${url}...`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
