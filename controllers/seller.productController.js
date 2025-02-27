import Product from "../models/products.js";



 const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status, rejectReason } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status, rejectReason: status === "rejected" ? rejectReason : "" },
      { new: true }
    );
    
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getProducts = async (req, res) => {
  try {
    const filters = req.query;
    const products = await Product.find(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export default {
    addProduct,
    updateProductStatus,
    updateProduct,
    removeProduct,
    getProducts,
}