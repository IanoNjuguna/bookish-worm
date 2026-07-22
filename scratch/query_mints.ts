import { Database } from "bun:sqlite";

const db = new Database("backend/core-api/doba.db");

console.log("=== Tracks ===");
const tracks = db.query("SELECT token_id, name, album_id, max_supply, uploader_address FROM tracks").all();
console.log(JSON.stringify(tracks, null, 2));

console.log("=== Mints ===");
const mints = db.query("SELECT * FROM mints").all();
console.log(JSON.stringify(mints, null, 2));
