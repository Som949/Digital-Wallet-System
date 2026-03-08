import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Dashboard(){

const [balance,setBalance] = useState(0);
const [addAmount,setAddAmount] = useState("");
const [withdrawAmount,setWithdrawAmount] = useState("");

const fetchBalance = async()=>{
const res = await API.get("/wallet/balance");
setBalance(res.data.balance);
};

useEffect(()=>{
fetchBalance();
},[]);

const handleAddMoney = async()=>{
await API.post("/wallet/add-money",{amount:addAmount});
alert("Money Added");
setAddAmount("");
fetchBalance();
};

const handleWithdraw = async()=>{
await API.post("/wallet/withdraw",{amount:withdrawAmount});
alert("Money Withdrawn");
setWithdrawAmount("");
fetchBalance();
};

return(

<div className="dashboard">

<Navbar/>

<h1>Wallet Dashboard</h1>

{/* BALANCE CARD */}

<div className="balance-card">

<p>Current Balance:</p>

<h2>₹ {balance}</h2>

</div>


{/* Add + Withdraw card */}

<div className="money-card">

{/* Add Money */}

<div className="money-box">

<h3>Add Money</h3>

<input
type="number"
placeholder="Enter Amount"
value={addAmount}
onChange={(e)=>setAddAmount(e.target.value)}
/>

<button onClick={handleAddMoney}>
Add Money
</button>

</div>


<hr/>


{/* Withdraw */}

<div className="money-box">

<h3>Withdraw Money</h3>

<input
type="number"
placeholder="Enter Amount"
value={withdrawAmount}
onChange={(e)=>setWithdrawAmount(e.target.value)}
/>

<button onClick={handleWithdraw}>
Withdraw
</button>

</div>

</div>



<div className="btns">

{/* Transfer */}
    
<div className="transfer-btn">

<Link to="/transfer">
<button>Transfer Money</button>
</Link>

</div>


{/* Transactions */}

<div className="transactions-btn">

<Link to="/transactions">
<button>View Transactions</button>
</Link>

</div>

</div>


</div>

);

}

export default Dashboard;