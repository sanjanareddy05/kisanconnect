import {useState} from "react";
import api from "../services/api";
export default ()=>{
  const [f,setF]=useState({name:"",price:"",category:"",location:""});
  const submit=async e=>{
    e.preventDefault();
    await api.post("/products",f);
    alert("Product added");
  };
  return (
    <div className="card">
      <h2>Add Product 🌾</h2>
      <input placeholder="Name" onChange={e=>setF({...f,name:e.target.value})}/>
      <input placeholder="Price" onChange={e=>setF({...f,price:e.target.value})}/>
      <input placeholder="Category" onChange={e=>setF({...f,category:e.target.value})}/>
      <input placeholder="Location" onChange={e=>setF({...f,location:e.target.value})}/>
      <button onClick={submit}>Add</button>
    </div>
  );
};