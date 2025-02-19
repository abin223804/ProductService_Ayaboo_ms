import mongoose from "mongoose";

const taxDetailsSchema = new mongoose.Schema({
  taxSlab: [
    {
      name: String,
    },
  ],
  isCess: Boolean,
  cess: Number,
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
  sample: Boolean,
  details: [variationDetailSchema],
});

const pricePerPieceSchema = new mongoose.Schema({
  minPiece: Number,
  maxPiece: Number,
  discount: Number,
});

const productDimensionsSchema = new mongoose.Schema({
  productHeight: Number,
  productLength: Number,
  productWidth: Number,
});

const productSchema = new mongoose.Schema(
  {
    productOwner: String,
    productName: String,
    mrp: Number,
    productSku: String,
    barcode: String,
    brand: String,
    keywords: String,
    minimumQuantity: Number,
    productWeight: Number,
    productDimensions: productDimensionsSchema,
    specialFeatures: String,
    careGuide: String,
    description: String,
    taxDetails: taxDetailsSchema,
    isFeaturedProduct: Boolean,
    isPublished: Boolean,
    isTodaysDeal: Boolean,
    isBestSelling: Boolean,
    galleryImage: [String],
    thumbnails: [String],
    variations: [variationSchema],
    sizeImages: [String],
    basePrice: Number,
    samplePrice: Number,
    discount: Number,
    discountType: String,
    pricePerPieces: [pricePerPieceSchema],
    selectWise: String,
    store: String,
    cod: Boolean,
    freeShipping: Boolean,
    ratingCount: Number,
    totalRatings: Number,
    unitSoled: Number,
    avgSalePerCustomer: Number,
    returnRate: Number,
    searchCount: Number,
    wishlistCount: Number,
    createdAt: Date,
    updatedAt: Date,
    status: String,
    rejectReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
