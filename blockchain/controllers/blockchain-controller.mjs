import { blockchain} from "../server.mjs";

export const listBlocks = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: blockchain.chain});
}