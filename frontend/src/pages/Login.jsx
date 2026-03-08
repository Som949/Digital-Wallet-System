import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/login.css";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// import walletImg from "../assets/images/wallet-illustration.png";

function Login() {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);

const handleLogin = async(e)=>{
e.preventDefault();

try{

const res = await API.post("/auth/login",{
email,
password
});

localStorage.setItem("token",res.data.token);

navigate("/dashboard");

}catch(err){

alert(err.response?.data?.message || "Login Failed");

}

};

return(

<div className="login-page">

{/* LEFT LOGIN CARD */}

<div className="login-container">

<h3 className="system-title">Digital Wallet System</h3>

<h2 className="login-title">SecurePay Wallet</h2>

<p className="welcome">Welcome Back!</p>

<form onSubmit={handleLogin}>

<div className="input-group">

<EmailIcon className="icon"/>

<input
type="email"
placeholder="enter your email address"
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>


<div className="input-group">

<LockIcon className="icon"/>

<input
type={showPassword ? "text" : "password"}
placeholder="enter your password"
onChange={(e)=>setPassword(e.target.value)}
required
/>

<span
className="toggle"
onClick={()=>setShowPassword(!showPassword)}
>

{showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}

</span>

</div>

<button className="login-btn">LOG IN</button>

</form>

<p className="register-text">
Don't have account?
<Link to="/register"> Register</Link>
</p>

</div>


{/* RIGHT IMAGE */}

{/* <div className="login-image">

<img src={walletImg} alt="wallet illustration"/>

</div> */}

</div>

);

}

export default Login;