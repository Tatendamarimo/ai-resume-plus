import app from "./app.js";
import { connectDB } from "./db/index.js";
import { config } from "dotenv";
config();

connectDB().then(() => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
