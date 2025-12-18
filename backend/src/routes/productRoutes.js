const r = require("express").Router();
const auth = require("../middleware/auth"); 
const role = require("../middleware/role");
const {
  createProduct,
  getProducts,
  deleteProduct
} = require("../controllers/productController");

r.get("/", getProducts);
r.post("/", auth, role("FARMER"), createProduct);
r.delete("/:id", auth, role("FARMER"), deleteProduct);

module.exports = r;
  