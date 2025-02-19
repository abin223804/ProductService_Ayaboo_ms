import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.post("/createCategory", categoryController.createCategory);
router.put("/updateCategory/:id", categoryController.updateCategory);
router.put("/deleteCate/:id", categoryController.softDeleteCategory);

export default router;
