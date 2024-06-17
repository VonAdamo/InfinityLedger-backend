import {INITIAL_BALANCE} from "../../config/settings.mjs";
import { ellipticHash, createHash } from "../utils/crypto-lib.mjs";
import Transaction from "./Transaction.mjs";

export default class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ellipticHash.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex");
    }
}