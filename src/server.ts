import { app } from "./app.js";
import { Db } from "./config/database.config.js";
app.listen("3000", () => {
  new Db(process.env.DB_LINK || "");
  console.log(`server is working`);
});
