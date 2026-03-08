import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/transfer.css";

function Transfer(){

const navigate = useNavigate();

const [receiverEmail,setReceiverEmail] = useState("");
const [amount,setAmount] = useState("");

const handleTransfer = async (e) => {

e.preventDefault();

try{

await API.post("/wallet/transfer",{
receiverEmail,
amount
});

alert("Money transferred successfully");

// 👇 redirect to dashboard
navigate("/dashboard");

}catch(error){

console.log(error);
alert("Transfer failed");

}

};

return(

<div className="transfer-container">

<h2>Transfer Money</h2>

<form onSubmit={handleTransfer}>

<input
type="email"
placeholder="Receiver Email"
value={receiverEmail}
onChange={(e)=>setReceiverEmail(e.target.value)}
/>

<input
type="number"
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<button type="submit">
Transfer Money
</button>

</form>

</div>

);

}

export default Transfer;