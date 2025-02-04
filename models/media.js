
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
  imageurl:{
    type: String,
  },
  category: {
    type: String,
  },
  uploadedAt: { type: Date, default: Date.now },
});

 const mediaModel = mongoose.model("media", mediaSchema);

 export default mediaModel;