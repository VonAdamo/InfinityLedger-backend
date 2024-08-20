import {it, describe, expect, beforeEach} from "vitest";
import TransactionPool from "../models/TransactionPool.mjs";
import Wallet from "../models/Wallet.mjs";
import Transaction from "../models/Transaction.mjs";
import Blockchain from "../models/Blockchain.mjs";

describe("TransactionPool", () => {
    let transactionPool, transaction, sender;
    sender = new Wallet();

    beforeEach(() => {
        transaction = new Transaction({
            sender,
            recipient: "Adam",
            amount: 50,
        });
        transactionPool = new TransactionPool();
    });

    describe("Propertiess", () => {
        it("should have a property named transactionMap", () => {
            expect(transactionPool).toHaveProperty("transactionMap");
        });
    });

    describe("addTransaction()", () => {
        it("should add a transaction to the transaction pool", () => {
            transactionPool.addTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toEqual(transaction);
        });
    });

    describe("transactionExists()", () => {
        it("should return a transaction based on its address", () => {
            transactionPool.addTransaction(transaction);
            expect(transactionPool.transactionExists({ address: sender.publicKey })).toEqual(transaction);
        });
    });

    describe("validTransactions method()", () => {
        let transactions;

        beforeEach(() => {
            transactions = [];

            for (let i = 0; i < 10; i++) {
                transaction = new Transaction({
                    sender, 
                    recipient: "Adam", 
                    amount: 50,
                });

                if(i % 3 === 0) {
                    transaction.inputMap.amount = 99999;
                } else if (i % 3 === 1) {
                    transaction.inputMap.signature = new Wallet().sign("bad!");
                } else {
                    transactions.push(transaction);
                }

                transactionPool.addTransaction(transaction);
            };
        });

        it("should return valid transactions", () => {
            expect(transactionPool.validateTransactions()).toStrictEqual(transactions);
        });
    });

    describe("clearBlockTransactions method()", () => {
        it("should clear the pool of existing blockchain transactions", () => {
            const blockchain = new Blockchain();
            const expectedMap = {};

            for (let i = 0; i < 20; i++) {
                const transaction = new Wallet().createTransaction({
                    recipient: "Adam",
                    amount: 50,
                });

                transactionPool.addTransaction(transaction);

                if(i % 2 === 0) {
                    blockchain.addBlock({ data: [transaction] });
                } else {
                    expectedMap[transaction.id] = transaction;
                }
            }

            transactionPool.clearBlockTransactions({ chain: blockchain.chain });

            expect(transactionPool.transactionMap).toEqual(expectedMap);
        });
    });
});