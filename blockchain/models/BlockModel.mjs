import mongoose from "mongoose";
import Block from "../models/Block.mjs";

const blockSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    blockIndex: {
        type: Number,
        required: true,
    },
    lastHash: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    nonce: {
        type: Number,
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
})

export default mongoose.model("Square", blockSchema);