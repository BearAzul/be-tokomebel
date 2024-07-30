import express from "express";
import { registerUser, loginUser, getCurrentUser, logoutUser, AllUser, deleteUser, updateUser } from "../controllers/authController.js";
import { ownerMiddleware, protectedMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", protectedMiddleware, logoutUser);

router.get("/getuser", protectedMiddleware, getCurrentUser);

router.get("/users", protectedMiddleware, ownerMiddleware, AllUser)

router.put("/users/:id", protectedMiddleware, upload.single("image"), updateUser)

router.delete("/users/:id",protectedMiddleware, deleteUser)

export default router;
