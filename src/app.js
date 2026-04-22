import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cryptoRoutes from "./routes/cryptoRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";

const app = express();

function normalizeOrigin(origin = "") {
  return origin.trim().replace(/\/+$/, "").toLowerCase();
}

const rawOrigins = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked this origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use(authRoutes);
app.use(cryptoRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
