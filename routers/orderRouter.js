import express from "express";
import { protectedMiddleware, ownerMiddleware } from "../middlewares/authMiddleware.js";
import { CreateOrder, AllOrder, DetailOrder, CurrentUserOrder, UpdateOrder, DeleteOrder } from "../controllers/OrderController.js";

const router = express.Router();

// post /api/v1/order
// cuma diakses user auth
router.post("/", protectedMiddleware, CreateOrder)

// get /api/v1/order
// cuman diakses oleh owner
router.get("/", protectedMiddleware, ownerMiddleware, AllOrder)

// get /api/v1/order/:id
// cuman diakses oleh owner
router.get("/:id", protectedMiddleware, ownerMiddleware, DetailOrder)

// put /api/v1/order/:id
// cuman diakses oleh owner
router.put("/:id", protectedMiddleware, ownerMiddleware, UpdateOrder)

// delete /api/v1/order/:id
// cuman diakses oleh owner
router.delete("/:id", protectedMiddleware, ownerMiddleware, DeleteOrder)

// get /api/v1/order/current/user
// cuman bisa dikases user auth
router.get("/current/user", protectedMiddleware, CurrentUserOrder)

export default router;
