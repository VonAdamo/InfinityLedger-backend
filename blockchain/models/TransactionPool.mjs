import Transaction from "../models/Transaction.mjs";

export default class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }
}