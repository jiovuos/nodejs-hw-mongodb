import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pino from "pino-http";

import contactsRouter from "./routes/contacts.js";
import authRouter from "./routes/auth.js";

import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const setupServer = () => {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true
    })
  );

  app.use(pino());
  app.use(express.json());

  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the Contacts API 👋",
      endpoints: {
        auth: "/auth",
        contacts: "/contacts"
      }
    });
  });

  app.use("/auth", authRouter);

  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
