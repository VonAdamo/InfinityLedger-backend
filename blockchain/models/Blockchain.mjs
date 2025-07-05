import { MINING_REWARD, REWARD_ADDRESS } from "../../config/settings.mjs";
import {createHash} from "../utils/crypto-lib.mjs";
import Block from "../models/Block.mjs";
import Transaction from "./Transaction.mjs";

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis];
    }

    addBlock ({ data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain.at(-1),
            data: data,
        });
        this.chain.push(newBlock);
        return newBlock;
    }

    getLastBlock() {
        return this.chain.at(-1);
    }

    replaceChain(chain, shouldValidate = false, callback) {
        if (chain.length <= this.chain.length) return;
        if (!Blockchain.isValidChain(chain)) return;

        if (shouldValidate && !this.validateTransactionData({ chain })) return;

        if (callback) callback();

        this.chain = chain;
    }

    validateTransactionData({ chain }) {

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const transactionSet = new Set();
            let counter = 0;

            for (let transaction of block.data) {

                if (transaction.inputMap.address === REWARD_ADDRESS.address) {
                    counter ++;

                    if (counter > 1) return false;

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) return false;
                } else {
                    if (!Transaction.validate(transaction)) {
                        return false;
                    }
            
                    if (transactionSet.has(transaction)) {
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }
        return true;
    };

    static isValidChain(chain) {
        if (!this.isValidGenesis(chain[0])) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const previousBlock = chain[i - 1];

            if (
                !this.isValidHash(block, previousBlock) ||
                !this.isValidDifficulty(block, previousBlock)
            ) {
                return false;
            }
        }
        return true;
    }

    static isValidGenesis(block) {
        return JSON.stringify(block) === JSON.stringify(Block.genesis);
    }

    static isValidHash(block, previousBlock) {
        const validHash = createHash(
            block.timestamp,
            block.lastHash,
            block.data,
            block.nonce,
            block.difficulty,
            block.blockIndex
        );
        return block.hash === validHash && block.lastHash === previousBlock.hash;
    }

    static isValidDifficulty(block, previousBlock, minDifficulty = 1) {

        if (block.difficulty < minDifficulty) return false;
        if (previousBlock.difficulty - block.difficulty > 1) return false;

        return Math.abs(previousBlock.difficulty - block.difficulty) <= 1;
    }


}