import {useNavigate} from "react-router-dom";
export default ()=>{
  const nav=useNavigate();
  return (
    <div className="container">
      <h1 style={{fontFamily:"Pacifico"}}>KisanConnect 🌾</h1>
      <p>Fresh produce directly from farmers</p>
      <button onClick={()=>nav("/home")}>View Products</button><br/><br/>
      <button onClick={()=>nav("/login")}>Login</button><br/><br/>
      <button onClick={()=>nav("/register")}>Register</button>
    </div>
  );
};