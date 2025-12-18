import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const nav = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="nav">
      <b>KisanConnect 🌾</b>

      <button onClick={() => nav("/")}>Home</button>
      <button onClick={() => nav(-1)}>Back</button>

      {isLoggedIn && (
        <button onClick={() => nav("/add-product")}>
          Add Product
        </button>
      )}

      {isLoggedIn && <button onClick={logout}>Logout</button>}
    </div>
  );
}
