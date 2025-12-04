import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();

// CORS Configuration (FIRST MIDDLEWARE!)
const corsOptions = {
  origin: process.env.ALLOWED_SITE ? process.env.ALLOWED_SITE.split(",") : ["http://localhost:5173"], // ← CHANGED THIS
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight

// Other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Plus API is running",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      resumes: "/api/resumes"
    }
  });
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);

export default app;