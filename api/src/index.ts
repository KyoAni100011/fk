import "dotenv/config";
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cookieParser from "cookie-parser";
import { prisma } from "../lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

// Trust proxy for secure cookies on Vercel
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Session configuration
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
    secret: process.env.SESSION_SECRET || "a-very-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

// Standardize response format globally to { success, data, error }
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (obj) {
    if (obj && typeof obj === "object" && "success" in obj && "error" in obj) {
      return originalJson.call(this, obj);
    }
    
    const isError = res.statusCode >= 400;
    const body = {
      success: !isError,
      data: isError ? null : obj,
      error: isError ? (obj?.message || obj?.errors || "Error") : null
    };
    return originalJson.call(this, body);
  };
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
