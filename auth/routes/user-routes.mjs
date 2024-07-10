import express from "express";
import { createUser, getUser, getUsers, updateUser, deleteUser } from "../controllers/user-controller.mjs";
import { protect, authorize } from "../middleware/authorization.mjs";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;