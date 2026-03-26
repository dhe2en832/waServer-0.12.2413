const fs = require("fs/promises");

async function makeCredentials() {
  try {
    // Check if credentials file already exists and has required fields
    try {
      const existing = await fs.readFile("./src/credentials.json", "utf8");
      const parsed = JSON.parse(existing);
      if (parsed.id && parsed.password) {
        console.log("Credentials already exist, skipping generation");
        process.exit(0);
      }
    } catch (e) {
      // File doesn't exist or invalid, continue with generation
    }

    const credentials = {
      token: process.env.ACCESS_TOKEN,
      id: process.env.ACCESS_ID,
      password: process.env.ACCESS_PWD,
      useWWebCache: process.env.USE_WWEB_CACHE?.toLowerCase() === "true",
      wwebCacheVersion: process.env.WWEB_CACHE_VER,
    };
    await fs.writeFile("./src/credentials.json", JSON.stringify(credentials));
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
}

makeCredentials();
