import Transaction from "../models/Transaction.mjs";
import Block from "../models/BlockSchema.mjs";
import { asyncHandler } from "../../auth/middleware/asyncHandler.mjs";

export default class Miner {
    constructor ({ blockchain, wallet, transactionPool, pubsub}) {
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.transactionPool = transactionPool;
        this.pubsub = pubsub;
    }

    mineTransactions() {
        const validTransactions = this.transactionPool.validateTransactions();

        validTransactions.push(
            Transaction.transactionReward ({ miner: this.wallet})
        );

        this.blockchain.addBlock({ data: validTransactions});
        this.pubsub.broadcastChain();
        this.transactionPool.clearTransactions();
    }
}