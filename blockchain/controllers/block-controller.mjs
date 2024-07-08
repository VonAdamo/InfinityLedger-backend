import { blockchain, pubnubServer } from "../../server.mjs"
import Square from "../models/BlockSchema.mjs"
import { asyncHandler } from "../../auth/middleware/asyncHandler.mjs";

//@desc    Mine a block
//@route   POST /api/v1/block/mine
//@access  PRIVATE
export const mineBlock = asyncHandler (async ( req, res, next) => {
    const data = req.body;
    
    const block = blockchain.addBlock({ data: data});
    
    const savedBlock = await Square.create(block);

    pubnubServer.broadcastChain();

    res.status(201).json({ success: true, statusCode: 201, data: block});
});