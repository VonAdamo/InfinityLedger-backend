import { STARTING_BACLANCE } from "../../config/settings.mjs";
import { ellipticHash, createHash } from "../utils/crypto-lib.mjs";
import Transaction from "./Transaction.mjs";

export default class Wallet {
    constructor() {
        this.balance = STARTING_BACLANCE;
        this.keyPair = ellipticHash.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex");
    }
}