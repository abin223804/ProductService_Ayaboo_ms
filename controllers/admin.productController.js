import Product from "../models/products.js";

const addProduct = async (req, res) => {
  try {
    if (!req.admin || !req.admin._id) {
      return res.status(401).json({ error: "Unauthorized: Admin not found." });
    }

    const product_owner = req.admin._id; 

    const {
      product_name,
      mrp,
      product_sku,
      barcode,
      brand,
      categoryId,
      keywords,
      minimum_quantity,
      product_weight,
      product_dimensions,
      tax_details,
      status,
      is_todays_deal,
      is_featured_product,
      description,
      gallery_image,
      thumbnails,
      sizeImages,
      discount_type,
      price_per_pieces,
      selectWise,
      variations,
      cod,
      freeShipping,
      basePrice,
      samplePrice,
      discount,
      store,
    } = req.body;

    if (!product_name || typeof product_name !== "string") {
      return res.status(400).json({ error: "Product name is required and must be a string." });
    }
    if (!mrp || isNaN(mrp) || Number(mrp) <= 0) {
      return res.status(400).json({ error: "MRP must be a positive number." });
    }
    if (!product_sku || typeof product_sku !== "string") {
      return res.status(400).json({ error: "Product SKU is required and must be a string." });
    }
    if (!brand) {
      return res.status(400).json({ error: "Brand ID is required." });
    }
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required." });
    }
    if (!minimum_quantity || isNaN(minimum_quantity) || Number(minimum_quantity) < 1) {
      return res.status(400).json({ error: "Minimum quantity must be a positive number." });
    }
    if (!store) {
      return res.status(400).json({ error: "Store ID is required." });
    }

    const newProduct = new Product({
      product_owner, 
      product_name,
      mrp: Number(mrp),
      product_sku,
      barcode,
      brand, 
      categoryId, 
      keywords,
      minimum_quantity: Number(minimum_quantity),
      product_weight: product_weight ? Number(product_weight) : undefined,
      product_dimensions,
      tax_details,
      is_featured_product: Boolean(is_featured_product),
      is_published: true, 
      is_todays_deal: Boolean(is_todays_deal),
      description,
      gallery_image,
      thumbnails,
      sizeImages,
      discount_type,
      price_per_pieces,
      selectWise,
      variations,
      cod: Boolean(cod),
      freeShipping: Boolean(freeShipping),
      basePrice: basePrice ? Number(basePrice) : undefined,
      samplePrice: samplePrice ? Number(samplePrice) : undefined,
      discount: discount ? Number(discount) : undefined,
      store, 
      status,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




export default {
    addProduct
    
}