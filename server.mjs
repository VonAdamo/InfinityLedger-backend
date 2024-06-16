import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
//import blockRouter from "./routes/block-routes.mjs";
//import blockchainRouter from "./blockchain/routes/blockchain-routes.mjs";


dotenv.config({path:"./config/config.env"});

const pubnubKeys = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID
};

const app = express();
app.use (cors());
app.use(express.json());

const DEFAULT_PORT = 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

//app.use("/api/v1/blockchain", blockchainRouter);
//app.use("/api/v1/block", blockRouter);


const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

