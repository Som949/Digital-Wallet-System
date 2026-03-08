import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/register.css";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Register(){

const navigate = useNavigate();

const [form,setForm] = useState({
full_name:"",
email:"",
phone:"",
password:""
});

const [showPassword,setShowPassword] = useState(false);

const handleSubmit = async (e) => {

e.preventDefault();

try {

await API.post("/auth/register", form);

alert("Registration successful");

navigate("/");

} catch (error) {

alert(error.response?.data?.message || "Registration failed");

}

};

return(

<div className="register-page">

<div className="register-container">

<h3 className="system-title">Digital Wallet System</h3>

<h2 className="register-title">SecurePay Wallet</h2>

<p className="subtitle">Create an Account</p>

<form onSubmit={handleSubmit}>

{/* FULL NAME */}

<div className="input-group">

<PersonIcon className="icon"/>

<input
type="text"
placeholder="Full Name"
onChange={(e)=>setForm({...form,full_name:e.target.value})}
required
/>

</div>


{/* EMAIL */}

<div className="input-group">

<EmailIcon className="icon"/>

<input
type="email"
placeholder="enter your email address"
onChange={(e)=>setForm({...form,email:e.target.value})}
required
/>

</div>


{/* PHONE */}

<div className="input-group">

<PhoneIcon className="icon"/>

<input
type="text"
placeholder="enter your phone number"
onChange={(e)=>setForm({...form,phone:e.target.value})}
required
/>

</div>


{/* PASSWORD */}

<div className="input-group">

<LockIcon className="icon"/>

<input
type={showPassword ? "text" : "password"}
placeholder="enter your password"
onChange={(e)=>setForm({...form,password:e.target.value})}
required
/>

<span
className="toggle"
onClick={()=>setShowPassword(!showPassword)}
>

{showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}

</span>

</div>


<button className="register-btn">
REGISTER
</button>

</form>


<p className="login-text">

Already have an account?

<Link to="/"> Login</Link>

</p>

</div>

</div>

);

}

export default Register;