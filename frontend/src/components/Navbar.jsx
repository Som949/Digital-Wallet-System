import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Navbar(){

const navigate = useNavigate();

const [open,setOpen] = useState(false);

const handleLogout = () => {
localStorage.removeItem("token");
navigate("/");
};

return(

<div className="navbar-wrapper">

<div className="navbar">

<h2 className="nav-title">Digital Wallet</h2>

<div className="nav-right">

<div className="profile-box" onClick={()=>setOpen(!open)}>

<AccountCircleIcon className="profile-icon"/>

<KeyboardArrowDownIcon/>

</div>

<span className="logout-btn" onClick={handleLogout}>
Logout
</span>

{open && (

<div className="dropdown">

<p onClick={()=>navigate("/dashboard")}>Dashboard</p>

<p onClick={()=>navigate("/profile")}>Profile</p>

</div>

)}

</div>

</div>

</div>

);

}

export default Navbar;