import mongoose from "mongoose";

const taxDetailsSchema = new mongoose.Schema(
  {
    taxSlab: [
      {
        name: String,
      },
    ],
    isCess: Boolean,
    cess: Number,
  },
  { _id: false }
);

const variationDetailSchema = new mongoose.Schema(
  {
    size: String,
    bundle_quantity: Number,
    stock: Number,
    discount: Number,
    selling_price: Number,
    skuId: String,
  },
  { _id: false }
);

const variationSchema = new mongoose.Schema(
  {
    image: String,
    colorCode: String,
    colorName: String,
    sample: Boolean,
    details: [variationDetailSchema],
  },
  { _id: false }
);

const pricePerPieceSchema = new mongoose.Schema(
  {
    min_Piece: Number,
    max_Piece: Number,
    discount: Number,
  },
  { _id: false }
);

const productDimensionsSchema = new mongoose.Schema(
  {
    product_height: Number,
    product_length: Number,
    product_width: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    _id: Number,
    product_owner: String,
    product_name: String,
    mrp: Number,
    product_sku: String,
    barcode: String,
    brand: String,
    keywords: String,
    minimum_quantity: Number,
    product_weight: Number,
    product_dimensions: productDimensionsSchema,
    special_features: String,
    care_guide: String,
    description: String,
    tax_details: taxDetailsSchema,
    is_featured_product: Boolean,
    is_published: Boolean,
    is_todays_deal: Boolean,
    is_best_selling: Boolean,
    gallery_image: [String],
    thumbnails: [String],
    variations: [variationSchema],
    sizeImages: [String],
    base_price: Number,
    sample_price: Number,
    discount: Number,
    discount_type: String,
    price_per_pieces: [pricePerPieceSchema],
    selectWise: String,
    store: String,
    cod: Boolean,
    freeShipping: Boolean,
    rating_count: Number,
    total_ratings: Number,
    unit_soled: Number,
    avg_sale_per_customer: Number,
    return_rate: Number,
    search_count: Number,
    wishlist_count: Number,
    createdAt: Date,
    updatedAt: Date,
    status: String,
    reject_reason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
