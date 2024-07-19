import { transactionPool, wallet, blockchain, pubnubServer} from "../../server.mjs";
import Miner from "../models/Miner.mjs";
import Wallet from "../models/Wallet.mjs";


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
    console.log ("addTransaction", transaction)

    res.status(201).json({ success: true, statusCode: 201, data: transaction});
};

//@desc    Get transaction pool
//@route   GET /api/v1/wallet/transactions
//@access  PRIVATE
export const getTransactionPool = ( req, res, next) => {
    res.status(200).json({ success: true, statusCode: 200, data: transactionPool.transactionMap});
};

//@desc    Get wallet balance
//@route   GET /api/v1/wallet/balance
//@access  PRIVATE
export const getWalletBalance = ( req, res, next) => {
    const address = wallet.publicKey;
    const balance = Wallet.calculateBalance({ chain: blockchain.chain, address});

    res.status(200).json({ success: true, statusCode: 200, data: {address: address, balance: balance,}});
};


//@desc    Mine transactions
//@route   GET /api/v1/wallet/mine
//@access  PRIVATE
export const mineTransactions = ( req, res, next) => {
    const miner = new Miner({ blockchain, transactionPool, wallet, pubsub: pubnubServer})

    miner.mineTransactions();

    res.status(200).json({ success: true, statusCode: 200, data: "Transactions verified and sent to block to be mined."});
}