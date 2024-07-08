import { blockchain } from "../../server.mjs";
import Blockchain from "../models/BlockchainSchema.mjs"
import { asyncHandler } from "../../auth/middleware/asyncHandler.mjs";

//@desc    Get all blocks
//@route   GET /api/v1/blockchain
//@access  PUBLIC
export const getBlocks = asyncHandler (async ( req, res, next) => {

    const savedBlockchain = await Blockchain.create({ chain: blockchain.chain });

    res.status(200).json({ success: true, statusCode: 200, data: blockchain.chain});
})