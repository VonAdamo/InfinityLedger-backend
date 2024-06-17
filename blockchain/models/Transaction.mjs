import { v4 as uuidv4 } from "uuid";
import { verifySignature } from "../utils/crypto-lib.mjs";
import { REWARD_ADDRESS, MINING_REWARD } from "../../config/settings.mjs";

export default class Transaction {
    constructor({ sender, recipient, amount, inputMap, outputMap}) {
        this.id = uuidv4().replaceAll("-", "");
        this.outputMap = outputMap || this.createOutputMap({ sender, recipient, amount});
        this.input = inputMap || this.createInputMap({ sender, outputMap: this.outputMap});
    }
}