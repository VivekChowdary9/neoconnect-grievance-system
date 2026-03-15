"use client";

import { useState } from "react";
import { login } from "../../services/authService";

export default function LoginPage() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      await login({ email,password });

      alert("Login Successful");

      window.location.href="/dashboard";

    }catch(err){

      alert(err.response?.data?.message || "Login Failed");

    }
  };

  return(

    <div style={{padding:"40px"}}>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

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

        <button type="submit">Login</button>

      </form>






    </div>
  );
}


