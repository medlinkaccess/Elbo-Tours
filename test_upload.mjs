import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import crypto from "crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("cloud_name:", cloudName);
console.log("api_key:", apiKey ? apiKey.slice(0,6) + "..." : "MISSING");
console.log("api_secret:", apiSecret ? "SET" : "MISSING");

const timestamp = Math.floor(Date.now() / 1000).toString();
const folder = "elbo-tours";
const signStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
const signature = crypto.createHash("sha256").update(signStr).digest("hex");

// Use a tiny test image (1x1 red pixel PNG base64)
const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";

const form = new FormData();
form.append("file", testImage);
form.append("api_key", apiKey);
form.append("timestamp", timestamp);
form.append("folder", folder);
form.append("signature", signature);

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: "POST",
  body: form,
});

const data = await res.json();
console.log("Status:", res.status);
console.log("Response:", JSON.stringify(data, null, 2));
