import express from "express";
import { register, login, getMe, updateUserDetails, updatePassword, forgotPassword, resetPassword } from "../controllers/auth-controller.mjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;