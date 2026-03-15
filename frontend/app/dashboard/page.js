"use client";

import { useEffect,useState } from "react";
import api from "../../services/api";
import { logout } from "../../services/authService";

export default function Dashboard(){

const [cases,setCases] = useState([]);

useEffect(()=>{

fetchCases();

},[]);

const fetchCases = async()=>{

try{

const res = await api.get("/cases");

setCases(res.data);

}catch(err){

console.log(err);

}

};

return(

<div style={{padding:"40px"}}>

<h2>Dashboard</h2>

<button onClick={logout}>Logout</button>

<h3>Your Cases</h3>

<ul>

{cases.map((c)=>(
<li key={c._id}>
{c.title} - {c.status}
</li>
))}

</ul>

</div>

);

}