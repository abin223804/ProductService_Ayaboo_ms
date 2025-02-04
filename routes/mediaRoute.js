import express from 'express';

import mediaController from '../controllers/mediaController.js';
import { mediaUpload } from '../config/multer.js';

const router = express();

router.post('/addMedia',mediaUpload, mediaController.createMedia);

router.get('/getAllMedia', mediaController.getAllMedia);

router.get('/getMediaById/:id', mediaController.getMediaById);

router.delete('/deleteMediaById/:id', mediaController.deleteMediaById);



export default router;