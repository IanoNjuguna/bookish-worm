import { Database } from "bun:sqlite";

const db = new Database("backend/core-api/doba.db");

console.log("=== Users ===");
const users = db.query("SELECT * FROM users").all();
console.log(JSON.stringify(users, null, 2));
