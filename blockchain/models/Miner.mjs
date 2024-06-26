import Transaction from "../models/Transaction.mjs";

export default class Miner {
    constructor ({ blockchain, wallet, transactionPool, pubsub}) {
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.transactionPool = transactionPool;
        this.pubsub = pubsub;
    }

    mineTransactions() {
        const validTransactions = this.transactionPool.validTransactions();

        validTransactions.push(
            Transaction.transactionReward ({ miner: this.wallet})
        );

        this.blockchain.addBlock({ data: validTransactions});
        this.pubsub.broadcastChain();
        this.transactionPool.clearTransactions();
    }
}