import { db } from "../config/db.js";

export const viewBalance = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [rows] = await db.execute(
            "SELECT balance FROM wallets WHERE user_id = ?",
            [userId]
        );

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//add money
export const addMoney = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { amount } = req.body;
        // console.log("UserId =", userId);
        // console.log("Amount =", amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // 1️⃣ Get wallet_id
    const [walletRows] = await db.execute(
      "SELECT wallet_id FROM wallets WHERE user_id = ?",
      [userId]
    );

    if (walletRows.length === 0) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const walletId = walletRows[0].wallet_id;

    // 2️⃣ 🔥 UPDATE WALLET BALANCE
    const [result] = await db.execute(
  "UPDATE wallets SET balance = balance + ? WHERE user_id = ?",
  [amount, userId]
);

console.log("Affected rows:", result.affectedRows);
    // 3️⃣ Insert transaction record
    await db.execute(
      `INSERT INTO transactions
      (sender_wallet, receiver_wallet, amount, txn_type, status)
      VALUES (?, ?, ?, 'DEPOSIT', 'SUCCESS')`,
      [null, walletId, amount]
    );

    res.json({ message: "Money added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

//history
// export const getTransactions = async (req, res) => {
//   try {
//     const userId = req.user.user_id;

//     // Get wallet_id of logged-in user
//     const [walletRows] = await db.execute(
//       "SELECT wallet_id FROM wallets WHERE user_id = ?",
//       [userId]
//     );

//     if (walletRows.length === 0) {
//       return res.status(404).json({ message: "Wallet not found" });
//     }

//     const walletId = walletRows[0].wallet_id;

//     // Get transactions where user is sender OR receiver
//     const [transactions] = await db.execute(
//       `SELECT * FROM transactions 
//        WHERE sender_wallet = ? OR receiver_wallet = ?
//        ORDER BY created_at DESC`,
//       [walletId, walletId]
//     );

//     res.json(transactions);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

//withdrawn
export const withdrawMoney = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Get wallet
    const [walletRows] = await db.execute(
      "SELECT wallet_id, balance FROM wallets WHERE user_id = ?",
      [userId]
    );

    if (walletRows.length === 0) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const walletId = walletRows[0].wallet_id;
    const currentBalance = parseFloat(walletRows[0].balance);

    if (currentBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    await db.execute(
      "UPDATE wallets SET balance = balance - ? WHERE user_id = ?",
      [amount, userId]
    );

    // Insert transaction
    await db.execute(
      `INSERT INTO transactions
       (sender_wallet, receiver_wallet, amount, txn_type, status)
       VALUES (?, ?, ?, 'WITHDRAW', 'SUCCESS')`,
      [walletId, null, amount]
    );

    res.json({ message: "Withdrawal successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//transfer
export const transferMoney = async (req, res) => {

  const connection = await db.getConnection(); // ❌ w hata diya

  try {

    const senderId = req.user.user_id;
    const { receiverEmail, amount } = req.body;

    if (!receiverEmail || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await connection.beginTransaction();

    // 1️⃣ Get sender wallet
    const [senderRows] = await connection.execute(
      "SELECT wallet_id, balance FROM wallets WHERE user_id = ? FOR UPDATE",
      [senderId]
    );

    if (senderRows.length === 0) {
      throw new Error("Sender wallet not found");
    }

    const senderWallet = senderRows[0].wallet_id;
    const senderBalance = parseFloat(senderRows[0].balance);

    if (senderBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // 2️⃣ Get receiver user by email
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [receiverEmail]
    );

    if (userRows.length === 0) {
      throw new Error("Receiver not found");
    }

    const receiverId = userRows[0].user_id;

    if (receiverId === senderId) {
      throw new Error("Cannot transfer to yourself");
    }

    // 3️⃣ Get receiver wallet
    const [receiverRows] = await connection.execute(
      "SELECT wallet_id FROM wallets WHERE user_id = ? FOR UPDATE",
      [receiverId]
    );

    if (receiverRows.length === 0) {
      throw new Error("Receiver wallet not found");
    }

    const receiverWallet = receiverRows[0].wallet_id;

    // 4️⃣ Deduct from sender
    await connection.execute(
      "UPDATE wallets SET balance = balance - ? WHERE user_id = ?",
      [amount, senderId]
    );

    // 5️⃣ Add to receiver
    await connection.execute(
      "UPDATE wallets SET balance = balance + ? WHERE user_id = ?",
      [amount, receiverId]
    );

    // 6️⃣ Insert transaction
    await connection.execute(
      `INSERT INTO transactions
       (sender_wallet, receiver_wallet, amount, txn_type, status)
       VALUES (?, ?, ?, 'TRANSFER', 'SUCCESS')`,
      [senderWallet, receiverWallet, amount]
    );

    await connection.commit();

    res.json({ message: "Transfer successful" });

  } catch (error) {

    await connection.rollback();
    console.log(error);

    res.status(400).json({ message: error.message });

  } finally {

    connection.release();

  }

};
//all transaction history
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get user's wallet id
    const [walletRows] = await db.execute(
      "SELECT wallet_id FROM wallets WHERE user_id = ?",
      [userId]
    );

    if (walletRows.length === 0) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const walletId = walletRows[0].wallet_id;

    // Get transactions where user is sender OR receiver
    // const [transactions] = await db.execute(
    //   `SELECT * FROM transactions 
    //    WHERE sender_wallet = ? 
    //    OR receiver_wallet = ?
    //    ORDER BY created_at DESC`,
    //   [walletId, walletId]
    // );

    const [transactions] = await db.execute(
      `
      SELECT 
        t.txn_id,
        t.amount,
        t.txn_type,
        t.status,
        t.created_at,
        sw.user_id AS sender_id,
        rw.user_id AS receiver_id,
        su.email AS sender_email,
        ru.email AS receiver_email
      FROM transactions t
      LEFT JOIN wallets sw ON t.sender_wallet = sw.wallet_id
      LEFT JOIN wallets rw ON t.receiver_wallet = rw.wallet_id
      LEFT JOIN users su ON sw.user_id = su.user_id
      LEFT JOIN users ru ON rw.user_id = ru.user_id
      WHERE t.sender_wallet = ? OR t.receiver_wallet = ?
      ORDER BY t.created_at DESC
      `,
      [walletId, walletId]
    );

    const formatted = transactions.map(txn => ({
      txn_id: txn.txn_id,
      amount: txn.amount,
      type: txn.txn_type,
      status: txn.status,
      created_at: txn.created_at,
      direction:
        txn.sender_id === userId ? "DEBIT" : "CREDIT",
      sender: txn.sender_email,
      receiver: txn.receiver_email
    }));

    res.json(formatted);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



