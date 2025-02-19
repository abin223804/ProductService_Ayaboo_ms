// import { Category } from "../models/category.js";
import { Category } from "../models/category.js";




const createCategory = async (req, res) => {
    try {
      const { name, parentId, coverImage, iconImage, published, featured } = req.body;
  
      const category = new Category({
        name,
        parentId: parentId || null,
        coverImage,
        iconImage,
        published: published || false,
        featured: featured || false,
      });
  
      await category.save();
      return res.status(201).json({ success: true, message: "Category created successfully", category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };



  const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      updateData.updatedAt = Date.now();
  
      const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      return res.status(200).json({ success: true, message: "Category updated successfully", category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  



  const softDeleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      return res.status(200).json({ success: true, message: "Category soft deleted successfully", category });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

  export default {
    createCategory,
    updateCategory,
    softDeleteCategory,
  };