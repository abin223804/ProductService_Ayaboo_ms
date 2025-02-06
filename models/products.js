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
    bundleQuantity: Number,
    stock: Number,
    discount: Number,
    sellingPrice: Number,
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
    minPiece: Number,
    maxPiece: Number,
    discount: Number,
  },
  { _id: false }
);

const productDimensionsSchema = new mongoose.Schema(
  {
    productHeight: Number,
    productLength: Number,
    productWidth: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    _id: Number,
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
