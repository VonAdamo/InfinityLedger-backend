import hexToBinary from "hex-to-binary";
import { GENESIS_DATA, MINE_RATE } from "../../config/settings.mjs";
import { createHash } from "../utils/crypto-lib.mjs";

export default class Block {
    constructor(timestamp, blockIndex, lastHash, hash, nonce, difficulty, data) {
        this.timestamp = timestamp;
        this.blockIndex = blockIndex;
        this.lastHash = lastHash;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.data = data;
    }

    static get genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock ({ lastBlock, data }) {
        const lastHash = lastBlock.hash;

        let { difficulty } = lastBlock;
        let hash, timestamp;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty ({ block: lastBlock, timestamp});
            hash = createHash(timestamp, blockIndex, lastHash, nonce, difficulty, data);
        }
        while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));
    
        return new this({timestamp, blockIndex, lastHash, hash, nonce, difficulty, data});
    }

    static adjustDifficulty ({ block, timestamp}) {
        const { difficulty } = block;
        
        if (timestamp - block.timestamp > MINE_RATE) {
            return Math.max(difficulty - 1, 1);
        }
        return difficulty + 1;
    }
}