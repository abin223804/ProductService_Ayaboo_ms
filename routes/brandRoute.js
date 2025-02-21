import express from "express";
import brandController from "../controllers/brandController.js";

const router = express.Router();

router.post("/createBrand", brandController.createBrand);
router.get("/getBrands", brandController.getAllBrands);

router.get("/getAllBrands", brandController.getAllBrands);

router.put("/updateBrand/:id", brandController.updateBrand);

router.put("/softDeleteBrand/:id", brandController.softDeleteBrand);
router.delete("/hardDeleteAllBrands", brandController.hardDeleteAllBrands);




export default router;