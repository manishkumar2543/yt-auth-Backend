import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./src/app.js";
import morgan from "morgan";
import connectDb from "./src/config/database.js";

app.use(morgan("dev"));

await connectDb();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});