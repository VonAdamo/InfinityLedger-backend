import { blockchain, pubnubServer } from "../../server.mjs"

//@desc    Mine a block
//@route   POST /api/v1/block/mine
//@access  PRIVATE
export const mineBlock = ( req, res, next) => {
    const data = req.body;

    const block = blockchain.addBlock({ data: data});

    pubnubServer.broadcastChain();

    res.status(201).json({ success: true, statusCode: 201, data: block});
}