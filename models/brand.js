import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
    trademarkNumber: {
      type: String,
    },
    trademarkCertificate: {
      type: String,
    },
    certificateOwnerName: {
      type: String,
    },
    nonObjectiveDocument: {
      type: String,
    },
    createdBy:{
      type: String,
      enum:[ "Seller","Store", "Admin"],
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum:[ "pending","rejected","approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", BrandSchema);
export default Brand;
