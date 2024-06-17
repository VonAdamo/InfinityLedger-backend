import Transaction from "../models/Transaction.mjs";

export default class Miner {
    constructor ({ blockchain, wallet, transactionPool, pubsub}) {
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.transactionPool = transactionPool;
        this.pubsub = pubsub;
    }
}