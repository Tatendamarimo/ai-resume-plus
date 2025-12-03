import app from "../src/app.js";
import { connectDB } from "../src/db/index.js";
import { config } from "dotenv";

config();

connectDB();

export default app;
