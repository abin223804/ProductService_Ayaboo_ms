import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.post("/createCategory", categoryController.createCategory);
router.put("/updateCategory/:id", categoryController.updateCategory);
router.put("/deleteCategory/:id", categoryController.softDeleteCategory);

router.get("/getCategories", categoryController.getAllCategories);

router.put("/toggle-published/:id", categoryController.togglePublished);
router.put("/toggle-featured/:id", categoryController.toggleFeatured);

export default router;
