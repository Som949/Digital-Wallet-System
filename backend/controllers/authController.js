import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";



export const getProfile = async (req, res) => {

try {

const userId = req.user.user_id;

const [userRows] = await db.execute(
"SELECT full_name, email, phone FROM users WHERE user_id = ?",
[userId]
);

const [walletRows] = await db.execute(
"SELECT wallet_id, balance FROM wallets WHERE user_id = ?",
[userId]
);

const walletId = walletRows[0].wallet_id;

const [txnRows] = await db.execute(
"SELECT COUNT(*) AS totalTransactions FROM transactions WHERE sender_wallet = ? OR receiver_wallet = ?",
[walletId, walletId]
);

res.json({
full_name: userRows[0].full_name,
email: userRows[0].email,
phone: userRows[0].phone,
wallet_id: walletRows[0].wallet_id,
balance: walletRows[0].balance,
totalTransactions: txnRows[0].totalTransactions
});

} catch (error) {

console.log(error);
res.status(500).json({ error: error.message });

}

};
export const registerUser = async (req, res) => {


console.log("REGISTER API HIT");
console.log(req.body);

    try {
        const { full_name, email, phone, password } = req.body;

        // 1️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2️⃣ Insert user
        const [result] = await db.execute(
            "INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
            [full_name, email, phone, hashedPassword]
        );

        const userId = result.insertId;

        // 3️⃣ Generate Wallet ID
        const walletId = "WLT" + Math.floor(10000 + Math.random() * 90000);

        // 4️⃣ Create wallet
        await db.execute(
            "INSERT INTO wallets (wallet_id, user_id) VALUES (?, ?)",
            [walletId, userId]
        );

        res.status(201).json({
            message: "User registered successfully",
            walletId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Check if user exists
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = rows[0];

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 3️⃣ Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

