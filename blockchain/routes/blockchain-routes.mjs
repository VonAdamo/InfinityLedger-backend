import express from "express";
import { getBlocks } from "../controllers/blockchain-controller.mjs";

const router = express.Router();

router.route("/").get(getBlocks);

export default router;