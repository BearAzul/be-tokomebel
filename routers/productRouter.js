import express from "express";
import { protectedMiddleware, ownerMiddleware } from "../middlewares/authMiddleware.js";

import { CreateProduct, AllProduct, detailProduct, updateProduct, deleteProduct, Fileupload } from "../controllers/productController.js"

import { upload } from "../utils/uploadFileHandler.js"

const router = express.Router();

// Crud Product

// Create data product
// post /api/v1/product
// middleware owner
router.post('/', protectedMiddleware, ownerMiddleware, CreateProduct)

// Read data product
// get api/v1/product
router.get('/', AllProduct)

// Detail data product
// get api/v1/product/:id
router.get('/:id', detailProduct)

// update data product
// put api/v1/product/:id
router.put('/:id',protectedMiddleware, ownerMiddleware, updateProduct)

// Delete data product
// delete api/v1/product/:id
router.delete('/:id', protectedMiddleware, ownerMiddleware, deleteProduct)

// File Upload
// post api/v1/product
router.post('/file-upload', protectedMiddleware, ownerMiddleware, upload.single('image'), Fileupload)

export default router;