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
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", BrandSchema);
export default Brand;
