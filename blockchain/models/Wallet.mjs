import { STARTING_BALANCE } from "../../config/settings.mjs";
import { ellipticHash, createHash } from "../utils/crypto-lib.mjs";
import Transaction from "./Transaction.mjs";

export default class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ellipticHash.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex");
    }

    static calculateBalance({ chain, address }) {
        let total = STARTING_BALANCE;
        let sentTransaction = false;
    
        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];
            for (let transaction of block.data) {
                // Check if the address has sent a transaction
                if (transaction.inputMap.address === address) {
                    sentTransaction = true;
                    // Subtract the total output values of the transaction (amount sent)
                    total -= transaction.inputMap.amount;
                }
                // Check if the address is a recipient in the transaction
                if (transaction.outputMap[address]) {
                    total += transaction.outputMap[address];
                }
            }
        }
    
        return total;
    }

    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({ chain, address: this.publicKey});
        }
        if (amount > this.balance) throw new Error("Amount exceeds balance");

        return new Transaction({ sender: this, recipient, amount });
    }

    sign(data) {
        return this.keyPair.sign(createHash(data));
    }
}