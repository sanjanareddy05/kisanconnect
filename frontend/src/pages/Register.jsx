import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "FARMER",
  });

  const submit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/auth/register", f);
    alert("Registered successfully. Please login.");
    nav("/login");
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Registration failed"
    );
  }
};


  return (
    <div className="card">
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setF({ ...f, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setF({ ...f, email: e.target.value })} />
      <input placeholder="Phone" onChange={e => setF({ ...f, phone: e.target.value })} />
      <input type="password" placeholder="Password"
             onChange={e => setF({ ...f, password: e.target.value })} />

      <select onChange={e => setF({ ...f, role: e.target.value })}>
        <option value="FARMER">Farmer</option>
        <option value="CONSUMER">Consumer</option>
      </select>

      <button onClick={submit}>Register</button>

      <p style={{ marginTop: "10px" }}>
        Already registered?{" "}
        <span
          style={{ color: "#2e7d32", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => nav("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
