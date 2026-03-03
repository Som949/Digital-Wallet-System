import express from "express";
import cors from "cors";
import { db } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.get("/", (req, res) => {
    res.send("Digital Wallet Backend Running 🚀");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

