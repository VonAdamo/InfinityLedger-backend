import {MINING_REWARD, REWARD_ADDRESS} from "./config/settings.mjs";
import { createHash } from "./utils/crypto-lib.mjs";
import Block from "./models/Block.mjs";
import Transaction from "./models/Transaction.mjs";

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis];
    }
}