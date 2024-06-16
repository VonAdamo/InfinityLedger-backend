import Block from "../models/Block.mjs";

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis];
    }
}