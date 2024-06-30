import express from "express";
import { createUser, getUser, getUsers, updateUser, deleteUser } from "../controllers/user-controller.mjs";

const router = express.Router();

router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;