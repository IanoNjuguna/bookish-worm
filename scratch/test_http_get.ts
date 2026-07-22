import { signJWT } from "../backend/core-api/src/auth";
import { Database } from "bun:sqlite";

const JWT_SECRET = process.env.JWT_SECRET || 'doba-default-secret-change-me';

async function run() {
  const db = new Database("backend/core-api/doba.db");
  
  console.log("=== Database Mints Before ===");
  console.log(db.query("SELECT * FROM mints").all());

  const userAddress = "stake_test1uqnesel09utj50sy96mqphjt4jsvqxzm5pdswnxetn6m9vg3fpwke";
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userAddress,
    iat: now,
    exp: now + 15 * 60
  };
  const token = await signJWT(payload, JWT_SECRET);

  console.log("Fetching GET http://localhost:3001/songs/1784280955851 with Auth header...");
  const res = await fetch("http://localhost:3001/songs/1784280955851", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const responseJson = await res.json();
  console.log("Response JSON:", responseJson);

  console.log("=== Database Mints After ===");
  console.log(db.query("SELECT * FROM mints").all());
}

run().catch(console.error);
