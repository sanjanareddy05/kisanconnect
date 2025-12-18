import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const isFarmer = role === "FARMER";

  const loadProducts = () => {
    api
      .get("/products", { params: { search } })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container">
      <h2>Products 🧺</h2>

      {isLoggedIn && (
        <button
          style={{ marginBottom: "16px" }}
          onClick={() => (window.location.href = "/add-product")}
        >
          ➕ Add New Product
        </button>
      )}

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={loadProducts} style={{ marginLeft: "8px" }}>
          Search
        </button>
      </div>

      {products.length === 0 && <p>No products found</p>}

      {products.map((product) => (
        <div key={product._id} className="card">
          <h3>{product.name}</h3>
          <p>₹{product.price}</p>
          <p>
            {product.category} • {product.location}
          </p>

          <p>
            <b>Farmer:</b>{" "}
            {product.farmerId ? product.farmerId.name : "Unknown"}
          </p>

          {product.farmerId ? (
            isLoggedIn ? (
              <p>
                <b>Phone:</b>{" "}
                {product.farmerId.phone || "Not provided"}
              </p>
            ) : (
              <p>
                <b>Phone:</b> Login to view
              </p>
            )
          ) : (
            <p>
              <b>Phone:</b> Hidden
            </p>
          )}

          {/* ✅ OWNER-ONLY DELETE */}
          {isFarmer &&
            product.farmerId &&
            product.farmerId._id === userId && (
              <button
                style={{ background: "#c62828", marginTop: "10px" }}
                onClick={() => deleteProduct(product._id)}
              >
                🗑 Delete
              </button>
            )}
        </div>
      ))}
    </div>
  );
}
