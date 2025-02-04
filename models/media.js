import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  size: {
    type: Number,
  },
  format: {
    type: String,
  },
  imageurl: {
    type: String,
  },
  category: {
    type: String,
  },
  uploadedBy: {
    type: String,
    enum: ["admin", "seller", "store", "user"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  width: {
    type: Number,  
    default: null,
  },
  height: {
    type: Number,  
    default: null,
  },
  uploadedAt: { type: Date, default: Date.now },
});

const mediaModel = mongoose.model("media", mediaSchema);

export default mediaModel;
