import mongoose from "mongoose";
import { blockchain } from "../../server.mjs";

const blockchainSchema = new mongoose.Schema({
    chain: {
        type: Array,
        required: true,
    },
});

export default mongoose.model("Blockchain", blockchainSchema);