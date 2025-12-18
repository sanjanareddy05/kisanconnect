const Product = require("../models/Product");
exports.createProduct = async (req,res)=>{
  const p = await Product.create({...req.body,farmerId:req.user.id});
  res.json(p);
};
exports.getProducts = async (req,res)=>{
  const { search, category, location } = req.query;
  let q = {};
  if(search) q.name = { $regex: search, $options: "i" };
  if(category) q.category = category;
  if(location) q.location = location;

  const products = await Product.find(q)
    .populate("farmerId","name phone");
  res.json(products);
};
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.farmerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to delete this product" });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
};
