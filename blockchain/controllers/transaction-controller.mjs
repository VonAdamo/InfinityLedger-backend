import { transactionPool, wallet, blockchain, pubnubServer} from "../../server.mjs";
import Miner from "../models/Miner.mjs";


//@desc    Add a transaction
//@route   POST /api/v1/wallet/transaction
//@access  PRIVATE
export const addTransaction = ( req, res, next) => {

    const { amount, recipient} = req.body;
    let transaction = transactionPool.transactionExists({ address: wallet.publicKey});

    try {
        if (transaction) {
            transaction.update({ sender: wallet, recipient, amount});
        } else {
            transaction = wallet.createTransaction({ recipient, amount})
        }
    } catch (error) {
        return res.status(400).json({ success: false, statusCode: 400, message: error.message});
    }
    transactionPool.addTransaction(transaction);
    pubnubServer.broadcastTransaction(transaction);

    res.status(201).json({ success: true, statusCode: 201, data: transaction});
};

//@desc    Get transaction pool
//@route   GET /api/v1/wallet/transactions
//@access  PRIVATE
export const getTransactionPool = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: "Transaction pool works"});
};

//@desc    Get wallet balance
//@route   GET /api/v1/wallet/balance
//@access  PRIVATE
export const getWalletBalance = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: "Wallet balance works"});
};


//@desc    Mine transactions
//@route   GET /api/v1/wallet/mine
//@access  PRIVATE
export const mineTransactions = ( req, res, next) => {
    const miner = new Miner({ blockchain, wallet, transactionPool})

    res.status(200).json({ success: true, statusCode: 200, data: "Transactions mined"});
}