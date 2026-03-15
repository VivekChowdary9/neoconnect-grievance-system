"use client";

import { useState } from "react";
import { register } from "../../services/authService";

export default function RegisterPage(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleSubmit = async (e) =>{

e.preventDefault();

try{

await register({name,email,password});

alert("Registered Successfully");

window.location.href="/login";

}catch(err){

alert(err.response?.data?.message || "Registration failed");

}

};

return(

<div style={{padding:"40px"}}>

<h2>Register</h2>

<form onSubmit={handleSubmit}>

<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
required
/>

<br/><br/>

<input
type="email"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
required
/>

<br/><br/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
required
/>

<br/><br/>

<button type="submit">Register</button>

</form>

</div>

);

}
