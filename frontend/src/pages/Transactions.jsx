import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/transactions.css";

function Transactions(){

const [data,setData] = useState([]);
const [search,setSearch] = useState("");
const [filter,setFilter] = useState("ALL");

const navigate = useNavigate();

useEffect(()=>{

const fetchData = async()=>{

const res = await API.get("/wallet/transactions");

setData(res.data);

};

fetchData();

},[]);


// search + filter logic
const filteredData = data.filter((txn)=>{

const searchMatch =
txn.sender?.toLowerCase().includes(search.toLowerCase()) ||
txn.receiver?.toLowerCase().includes(search.toLowerCase());

if(filter === "DEBIT"){
return searchMatch && txn.direction === "DEBIT";
}

if(filter === "CREDIT"){
return searchMatch && txn.direction === "CREDIT";
}

return searchMatch;

});

return(


<div className="transactions-page">

<div className="transactions-container">

<h2>Transaction History</h2>


{/* Search + Filter */}

<div className="filter-box">

<input
type="text"
placeholder="Search by email"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
>

<option value="ALL">All</option>
<option value="DEBIT">Debit</option>
<option value="CREDIT">Credit</option>

</select>

</div>


<table>

<thead>

<tr>
<th>ID</th>
<th>Type</th>
<th>Amount</th>
<th>Direction</th>
<th>Sender</th>
<th>Receiver</th>
<th>Status</th>
<th>Date</th>
</tr>

</thead>

<tbody>

{filteredData.map((txn)=>(

<tr key={txn.txn_id}>

<td>{txn.txn_id}</td>

<td>{txn.type}</td>

<td>₹ {txn.amount}</td>

<td className={txn.direction === "DEBIT" ? "debit" : "credit"}>
{txn.direction}
</td>

<td>{txn.sender || "-"}</td>

<td>{txn.receiver || "-"}</td>

<td>{txn.status}</td>

<td>{new Date(txn.created_at).toLocaleString()}</td>

</tr>

))}

</tbody>

</table>


<button className="back-btn" onClick={()=>navigate("/dashboard")}>
Back to Dashboard
</button>

</div>
</div>
);

}

export default Transactions;