import mongoose from "mongoose";

const taxDetailsSchema = new mongoose.Schema({
  hsn_sac_number: String,
  non_gst_goods: {
    type: String,
    enum: ["yes", "no"],
  },
  calculation_types: {
    type: String,
    enum: ["on_item_rate" , "on_value"],
  },
  on_items_rate_details: [
    {
      greaterThan: Number,
      upto: Number,
      igst: Number,
      cgst: Number,
      sgst: Number,
      cess: Number,
    },
  ],
  isCess: { type: Boolean, default: false },
});

const variationDetailSchema = new mongoose.Schema({
  size: String,
  bundleQuantity: Number,
  stock: Number,
  discount: Number,
  sellingPrice: Number,
  skuId: String,
});

const variationSchema = new mongoose.Schema({
  image: String,
  colorCode: String,
  colorName: String,
  sample: { type: Boolean, default: false },
  details: [variationDetailSchema],
});

const pricePerPieceSchema = new mongoose.Schema({
  minPiece: Number,
  maxPiece: Number,
  discount: Number,
});

const productDimensionsSchema = new mongoose.Schema({
  product_height: Number,
  product_length: Number,
  product_width: Number,
});

const productSchema = new mongoose.Schema(
  {
    product_owner: String,
    product_name: String,
    mrp: Number,
    product_sku: String,
    barcode: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    keywords: [String],
    minimum_quantity: Number,
    product_weight: Number,
    product_dimensions: productDimensionsSchema,
    description: String,
    tax_details: taxDetailsSchema,
    is_featured_product: { type: Boolean, default: false },
    is_published: { type: Boolean, default: false },
    is_todays_deal: { type: Boolean, default: false },
    gallery_image: [String],
    thumbnails: [String],
    sizeImages: [String],
    basePrice: Number,
    samplePrice: Number,
    discount: Number,
    discount_type: String,
    price_per_pieces: [pricePerPieceSchema],
    selectWise: String,
    variations: [variationSchema],
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    cod: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    ratingCount: Number,
    totalRatings: Number,
    unitSold: Number,
    avgSalePerCustomer: Number,
    returnRate: Number,
    searchCount: Number,
    wishlistCount: Number,
    status: String,
    rejectReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
