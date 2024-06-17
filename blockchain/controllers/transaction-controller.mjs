import { transactionPool} from "../../server.mjs";
import { wallet} from "../../server.mjs";
import { blockchain} from "../../server.mjs";
import Miner from "../models/Miner.mjs";
import Wallet from "../models/Wallet.mjs";

//@desc    Add a transaction
//@route   POST /api/v1/wallet/transaction
//@access  PRIVATE
export const addTransaction = ( req, res, next) => {

    res.status(201).json({ success: true, statusCode: 201, data: "Transaction works"});
};

//@desc    Get wallet balance
//@route   GET /api/v1/wallet
//@access  PRIVATE
export const getWalletBalance = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: "Wallet balance works"});
};

//@desc    Get transaction pool
//@route   GET /api/v1/wallet/transaction-pool
//@access  PRIVATE
export const getTransactionPool = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: "Transaction pool works"});
};

//@desc    Mine transactions
//@route   POST /api/v1/wallet/mine
//@access  PRIVATE
export const mineTransactions = ( req, res, next) => {
    const miner = new Miner({ blockchain, wallet, transactionPool})

    miner.mineTransactions();

    res.status(200).json({ success: true, statusCode: 200, data: "Transactions mined"});
}