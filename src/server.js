import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsRouter from "./routes/contacts.js";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to the Contacts API 👋",
      endpoints: {
        contacts: "/contacts"
      }
    });
  });

  app.use("/contacts", contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
