import Category from "../models/category.js";

const createCategory = async (req, res) => {

  try {
    const { name, parentId, coverImage, iconImage } = req.body;

    const existingCategory = await Category.findOne({
      name,
      isDeleted: false,
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }

    let parentCategory = null;
    if (parentId) {
      parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res
          .status(400)
          .json({ success: false, message: "Parent category not found" });
      }
    }

    const category = new Category({
      name,
      parentId: parentId || null,
      coverImage,
      iconImage,
    });

    await category.save();

    if (parentCategory) {
      parentCategory.subcategories.push(category._id);
      await parentCategory.save();
    }

    return res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        category,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find({ isDeleted: false }).populate("subcategories");
      return res.status(200).json({ success: true, categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

 const updateCategory = async (req, res) => {
    try {
      const { name, parentId, coverImage, iconImage } = req.body;
      const { id } = req.params;
  
      const category = await Category.findById(id);
      if (!category || category.isDeleted) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      
      if (name) {
        const existingCategory = await Category.findOne({ name, _id: { $ne: id }, isDeleted: false });
        if (existingCategory) {
          return res.status(400).json({ success: false, message: "Category name already exists" });
        }
      }
  
      let parentCategory = null;
      if (parentId && parentId !== category.parentId?.toString()) {
        parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
          return res.status(400).json({ success: false, message: "Parent category not found" });
        }
  
        
        if (category.parentId) {
          await Category.findByIdAndUpdate(category.parentId, { $pull: { subcategories: id } });
        }
  
        
        parentCategory.subcategories.push(id);
        await parentCategory.save();
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name, parentId: parentId || null, coverImage, iconImage, updatedAt: Date.now() },
        { new: true }
      );
  
      return res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  
  const softDeleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findById(id);
      if (!category || category.isDeleted) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      
      if (category.parentId) {
        await Category.findByIdAndUpdate(category.parentId, { $pull: { subcategories: id } });
      }
  
      
      category.isDeleted = true;
      category.updatedAt = Date.now();
      await category.save();
  
      return res.status(200).json({ success: true, message: "Category soft deleted successfully", category: category});
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };

//   const togglePublished = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const category = await Category.findById(id);
//       if (!category || category.isDeleted) {
//         return res.status(404).json({ success: false, message: "Category not found" });
//       }
  
//       category.published = !category.published;
//       category.updatedAt = Date.now();
//       await category.save();
  
//       return res.status(200).json({ success: true, message: `Category published status updated to ${category.published}`, category });
//     } catch (error) {
//       return res.status(500).json({ success: false, message: "Server error", error: error.message });
//     }
//   };

//   const toggleFeatured = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const category = await Category.findById(id);
//       if (!category || category.isDeleted) {
//         return res.status(404).json({ success: false, message: "Category not found" });
//       }
  
//       category.featured = !category.featured;
//       category.updatedAt = Date.now();
//       await category.save();
  
//       return res.status(200).json({ success: true, message: `Category featured status updated to ${category.featured}`, category });
//     } catch (error) {
//       return res.status(500).json({ success: false, message: "Server error", error: error.message });
//     }
//   };


 const toggleCategoryStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { field } = req.body; 
  
      if (!["published", "featured"].includes(field)) {
        return res.status(400).json({ success: false, message: "Invalid field. Allowed: 'published', 'featured'" });
      }
  
      const category = await Category.findById(id);
      if (!category || category.isDeleted) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      category[field] = !category[field]; 
      category.updatedAt = Date.now();
      await category.save();
  
      return res.status(200).json({ 
        success: true, 
        message: `Category ${field} status updated to ${category[field]}`, 
        category 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };



export default {
  createCategory,
  updateCategory,
  getAllCategories,
  softDeleteCategory,
//   togglePublished,
//   toggleFeatured,
  getAllCategories,
  toggleCategoryStatus
};
