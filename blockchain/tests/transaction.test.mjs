import { it, describe, expect, beforeEach} from "vitest";
import Transaction from "../models/Transaction.mjs";
import Wallet from "../models/Wallet.mjs";
import { verifySignature} from "../utils/crypto-lib.mjs";
import { MINING_REWARD, REWARD_ADDRESS } from "../../config/settings.mjs";

describe("Transaction", () => {
    let transaction, sender, recipient, amount;

    beforeEach(() => {
        sender = new Wallet();
        recipient = "Adam";
        amount = 50;
        transaction = new Transaction({ sender, recipient, amount});
    });

    describe("Properties", () => {
        it("should have a property called id", () => {
            expect(transaction).toHaveProperty("id");
        });
    });

    describe("OutputMap", () => {
        it("should have a property called outputMap", () => {
            expect(transaction).toHaveProperty("outputMap");
        });

        it("should output the recipients balance", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it("should output the senders balance", () => {
            expect(transaction.outputMap[sender.publicKey]).toEqual(
                sender.balance - amount
            );
        });
    });

    describe("inputMap", () => {
        it("should have a property called inputMap", () => {
            expect(transaction).toHaveProperty("inputMap");
        });

        it("should have a timestamp", () => {
            expect(transaction.inputMap).toHaveProperty("timestamp");
        });

        it("should set the amount to the senders balance", () => {
            expect(transaction.inputMap.amount).toEqual(sender.balance);
        });

        it("should set the address value to the senders publicKey", () => {
            expect(transaction.inputMap.address).toEqual(sender.publicKey);
        });

        it("should sign the inputMap", () => {
            expect(verifySignature({
                publicKey: sender.publicKey,
                data:transaction.outputMap,
                signature: transaction.inputMap.signature,
                })
            ).toBe(true);
        });
    });

    describe("Validate transaction", () => {
        describe("when the transaction is valid", () => {
            it("should return true", () => {
                expect(Transaction.validate(transaction)).toBe(true);
            });
        });

        describe("when the transaction is invalid", () => {
            describe("and the transcation outputMap value is invalid", () => {
                it("should return false", () => {
                    transaction.outputMap[sender.publicKey]= 999999;
                    expect(Transaction.validate(transaction)).toBe(false);
                });
            });

            describe("and the transaction inputMap signature is invalid", () => {
                it("should return false", () => {
                    transaction.inputMap.signature = new Wallet().sign("data");
                    expect(Transaction.validate(transaction)).toBe(false);
                });
            });
        });
    });

    describe('Update transaction', () => {
        let orgSignature, orgSenderOutput, nextRecipient, nextAmount;
    
        describe('and the amount is invalid(not enough funds)', () => {
          it('should throw an error', () => {
            expect(() => {
              transaction.update({ sender, recipient, amount: 1010 });
            }).toThrow('Amount exceeds balance');
          });
        });

        describe("and the amount is valid", () => {
            beforeEach(() => {
                orgSignature = transaction.inputMap.signature;
                orgSenderOutput = transaction.outputMap[sender.publicKey];
                nextAmount = 20;
                nextRecipient = "Milla";

                transaction.update({
                    sender,
                    recipient: nextRecipient,
                    amount: nextAmount,
                });
            });

            it("should output the amount to the next recipient", () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });

            it("should withdraw the amnount from the original sender output balance", () => {
                expect(transaction.outputMap[sender.publicKey]).toEqual(orgSenderOutput - nextAmount);
            });

            it("should match the total output amount with the inputMap amount", () => {
                expect(Object.values(transaction.outputMap).reduce((total, amount) => total + amount)).toEqual(transaction.inputMap.amount);
            });

            it("should create a new signature for the transaction", () => {
                expect(transaction.inputMap.signature).not.toEqual(orgSignature);
            });
        });
    });

    describe("Transaction reward", () => {
        let transactionReward, miner;

        beforeEach(() => {
            miner = new Wallet();
            transactionReward = Transaction.transactionReward({ miner });
        });

        it("should create a reward transaction with the address of the miner", () => {
            expect(transactionReward.inputMap).toEqual(REWARD_ADDRESS);
        })

        it("should create a reward transaction with the amount of the MINING_REWARD", () => {
            expect(transactionReward.outputMap[miner.publicKey]).toEqual(MINING_REWARD);
        });
    });

    describe("when the transaction results in the sender having zero balance", () => {

        it("should not allow a transaction that results in a negative balance", () => {
            expect(() => {
                transaction.update({
                    sender,
                    recipient,
                    amount: sender.balance + 1,
                });
            }).toThrow("Amount exceeds balance");
        });
    })
});