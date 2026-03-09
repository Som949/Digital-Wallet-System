# 🏦 Digital-Wallet-System

The **Digital Wallet System** is a secure, database-driven application built using **Node.js, Express, and MySQL**.  

This project simulates real-world wallet operations and demonstrates core **DBMS concepts** including relational schema design, normalization, ACID transactions, and role-based access control.

---

## 📌 Project Description

The Digital Wallet System allows users to:

- Register and Login securely
- Automatically generate a Unique Wallet ID
- Add money to wallet
- Withdraw money
- Transfer money using Wallet ID
- View transaction history

Admin users can:

- View all registered users
- Monitor all transactions
- Freeze user accounts
- View system analytics

---

## 🛠 Technologies Used

### 🌐 Frontend
- React.js to build Component
- Material ui use to take icones
- JavaScript (Fetch API) – Client-side validation and API calls  

### 🖥 Backend
- Node.js – JavaScript runtime environment  
- Express.js – Backend framework for building REST APIs  
- MySQL2 – Database connectivity package  

---

## 🏗 System Architecture (3 Layers)

### 🔹 Layer 1: Access & Identity
- User Registration
- Login Authentication
- Password Hashing
- Role-Based Access Control
- Unique Wallet ID Generation

### 🔹 Layer 2: Wallet & Balance Management
- Automatic Wallet Creation  
- Add Money
- Withdraw Money
- Transfer Money
- Secure Balance Storage
- ACID Transaction Support

### 🔹 Layer 3: Transaction & Admin Control
- Transaction History Logging
- Foreign Key Relationships
- Admin Monitoring
- Account Freeze System
- Analytics Support

---

