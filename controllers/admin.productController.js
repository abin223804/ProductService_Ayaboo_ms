import Product from "../models/products.js";

const addProduct = async (req, res) => {
  try {
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
      description,
      tax_details,
      is_featured_product,
      is_todays_deal,
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
      status,
    } = req.body;

    let productOwner = req.admin ? "admin" :null;

    if (!productOwner) {
      return res.status(403).json({ success: false, message: "Unauthorized: No valid owner found." });
    }

    const newProduct = new Product({
      product_owner: productOwner,
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
      description,
      tax_details,
      is_featured_product: Boolean(is_featured_product),
      is_published: productOwner === "admin", 
      is_todays_deal: Boolean(is_todays_deal),
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
      status: status || "pending",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};





export default {
    addProduct
    
}