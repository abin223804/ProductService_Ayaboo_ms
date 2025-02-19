import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  subcategories: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  coverImage: {
    type: String,
  },
  iconImage: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
