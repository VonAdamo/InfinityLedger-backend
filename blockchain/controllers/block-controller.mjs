import { blockchain, pubnubServer } from "../../server.mjs"
import Square from "../models/BlockModel.mjs"
import { asyncHandler } from "../../auth/middleware/asyncHandler.mjs";

//@desc    Mine a block
//@route   POST /api/v1/block/mine
//@access  PRIVATE
export const mineBlock = asyncHandler (async ( req, res, next) => {
    const data = req.body;
    
    const block = blockchain.addBlock({ data: data});
    
    const blockData = await Square.create(data);

    pubnubServer.broadcastChain();

    res.status(201).json({ success: true, statusCode: 201, data: block});
});