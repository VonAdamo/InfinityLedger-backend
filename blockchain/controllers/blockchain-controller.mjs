import { blockchain } from "../../server.mjs";

//@desc    Get all blocks
//@route   GET /api/v1/blockchain
//@access  PUBLIC
export const getBlocks = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: blockchain.chain});
}