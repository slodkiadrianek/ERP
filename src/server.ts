import { app } from "./app.js";
import { Db } from "./config/database.config.js";
import { caching } from "./app.js";
app.listen("3000", async () => {
  new Db(process.env.DB_LINK || "");
  await caching.set("key", "value");
  const value = await caching.get("key");
  if (value) {
    console.log(`Caching service is working`);
  }
  console.log(`server is working`);
});
