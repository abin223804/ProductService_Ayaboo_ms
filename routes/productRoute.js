import express from 'express';
import { authenticateAdmin } from '../middlewares/auth.js';
import adminProductController from '../controllers/admin.productController.js';


const router = express.Router();


router.post('/addProduct', authenticateAdmin, adminProductController.addProduct);



export default router;