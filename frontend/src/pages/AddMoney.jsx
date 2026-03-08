import {useState} from "react";
import API from "../services/api";

function AddMoney(){

const [amount,setAmount] = useState("");

const addMoney = async()=>{

await API.post("/wallet/add-money",{amount});

alert("Money Added");

};

return(

<div>

<input
placeholder="Enter amount"
onChange={(e)=>setAmount(e.target.value)}
/>

<button onClick={addMoney}>
Add Money
</button>

</div>

);

}

export default AddMoney;