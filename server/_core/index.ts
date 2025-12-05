import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context"; // HANYA PAKAI INI — TIDAK ADA setupVite

async function startServer() {
  const app = express();
  const server = createServer(app);

  // FRONTEND VITE = 5173
  // BACKEND SERVER = 3000
  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.use(cookieParser());
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  const PORT = process.env.PORT || 5000;
  server.listen(process.env.PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

startServer().catch(console.error);
