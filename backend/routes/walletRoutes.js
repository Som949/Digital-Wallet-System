import express from "express";
import { viewBalance, addMoney, getTransactions  } from "../controllers/walletController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { withdrawMoney } from "../controllers/walletController.js";
import { transferMoney } from "../controllers/walletController.js";

const router = express.Router();

router.get("/balance", verifyToken, viewBalance);
router.post("/add-money", verifyToken, addMoney);
router.get("/transactions", verifyToken, getTransactions);
router.post("/withdraw", verifyToken, withdrawMoney);
router.post("/transfer", verifyToken, transferMoney);

export default router;

