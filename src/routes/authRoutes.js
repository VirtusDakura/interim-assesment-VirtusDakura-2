import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/register").get(register).post(register);
router.route("/login").get(login).post(login);
router.get("/profile", protect, getProfile);
router.post("/logout", logout);

export default router;
