import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
  e.preventDefault();
  const res = await api.post("/auth/login", { email, password });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.role);
  localStorage.setItem("userId", res.data.userId);

  alert("Logged in successfully");
  window.location.href = "/home";
};


  return (
    <div className="card">
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
             onChange={e => setPassword(e.target.value)} />

      <button onClick={submit}>Login</button>
    </div>
  );
}
