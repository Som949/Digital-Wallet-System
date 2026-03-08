import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/profile.css";

function Profile(){

const [user,setUser] = useState({});

useEffect(()=>{

const fetchProfile = async () => {

const res = await API.get("/auth/profile");
setUser(res.data);

};

fetchProfile();

},[]);

return(

<div className="profile-page">

<Navbar/>

<div className="profile-container">

<div className="profile-card">

<div className="profile-title">
User Profile
</div>

<div className="profile-details">

<p><strong>Name :</strong> {user.full_name}</p>

<p><strong>Email :</strong> {user.email}</p>

<p><strong>Phone :</strong> {user.phone}</p>

<p><strong>Wallet ID :</strong> {user.wallet_id}</p>

<p><strong>Balance :</strong> ₹ {user.balance}</p>

<p><strong>Total Transactions :</strong> {user.totalTransactions}</p>

</div>

</div>

</div>

</div>

);

}

export default Profile;