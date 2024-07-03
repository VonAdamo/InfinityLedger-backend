import mongoose from "mongoose";

const blockDataSchema = new mongoose.Schema({
    data: {
        type: String,
        required: [true, "Please provide data"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("BlockData", blockDataSchema);