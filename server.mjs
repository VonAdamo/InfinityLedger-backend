import express from "express";
import dotenv from "dotenv";
import {connectDb} from "./config/mongo.mjs";
import colors from "colors";
import morgan from "morgan";
import Blockchain from "./blockchain/models/Blockchain.mjs"
import TransactionPool from "./blockchain/models/TransactionPool.mjs";
import Wallet from "./blockchain/models/Wallet.mjs";
import userRouter from "./auth/routes/user-routes.mjs";
import authRouter from "./auth/routes/auth-routes.mjs";
import blockRouter from "./blockchain/routes/block-routes.mjs";
import blockchainRouter from "./blockchain/routes/blockchain-routes.mjs";
import transactionRouter from "./blockchain/routes/transaction-routes.mjs";
import ErrorResponse from "./blockchain/utils/ErrorResponseModel.mjs";
import errorHandler from "./blockchain/middleware/errorHandler.mjs";
import PubNubServer from "./pubnub-server.mjs";
import cors from "cors";

dotenv.config({path:"./config/config.env"});

connectDb();

const pubnubKeys = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID
};

export const blockchain = new Blockchain();
export const transactionPool = new TransactionPool();
export const wallet = new Wallet();
export const pubnubServer = new PubNubServer({ blockchain, transactionPool, wallet, pubnubKeys });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const DEFAULT_PORT = 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
    pubnubServer.broadcastChain();
}, 1000);

app.use("/api/v1/blockchain", blockchainRouter);
app.use("/api/v1/block", blockRouter);
app.use("/api/v1/wallet", transactionRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);


app.all("*", (req, res, next) => {
    next(new ErrorResponse(`${req.originalUrl} route not found`, 404));
});  
app.use(errorHandler);


const synchronizeNetwork = async () => {
    let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
    if (response.ok) {
        const result = await response.json();
        blockchain.replaceChain(result.data);
    }

    response = await fetch(`${ROOT_NODE}/api/v1/wallet/transactions`);
    if (response.ok) {
        const result = await response.json();
        transactionPool.replaceTransactionMap(result.data);
    }
};

if (process.env.GENERATE_NODE_PORT === "true") {
    NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
    synchronizeNetwork();
}
        
const PORT = NODE_PORT || DEFAULT_PORT;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        synchronizeNetwork();
    }
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});

