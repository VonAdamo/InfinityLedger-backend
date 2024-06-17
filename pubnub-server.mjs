import Pubnub from "pubnub";

const CHANNELS = {
    BLOCKCHAIN: "BLOCKCHAIN",
    NETWORK: "NETWORK",
    TRANSACTION: "TRANSACTION"
}

export default class PubNubServer {
    constructor ({ blockchain, transactionPool, wallet, pubnubKeys}) {
        this.blockchain = blockchain;
        this.transactionPool= transactionPool;
        this.wallet = wallet;
        this.pubnub = new Pubnub(pubnubKeys);
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());

        this.requestChain();
    }

    broadcastChain(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }

    broadcastTransaction(transaction){
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction),
        });
    }

    requestChain(){
        this.publish({
            channel: CHANNELS.NETWORK,
            message: {type: "REQUEST_CHAIN"},
        })
    }

    listener() {
        return {
            message:(msgObject) => {
                const { channel, message} = msgObject;
                const msg = JSON.parse(message);

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);

                switch(channel){
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(msg, true, () => {
                            this.transactionPool.clearBlockTransactions({ chain: msg });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.transactionExists({
                            address: this.wallet.publicKey,
                        })) {
                            this.transactionPool.addTransaction(msg);
                        }
                        break;
                    case CHANNELS.NETWORK:
                        this.handleNetworkMessage(msg);
                        break;
                    default:
                    return;
                }
            }
        }
    }

    handleNetworkMessage(msg) {
        if (msg.type === "REQUEST_CHAIN") {
            this.publish({
                channel: CHANNELS.BLOCKCHAIN,
                message: JSON.stringify({
                    type: "CHAIN_RESPONSE",
                    chain: this.blockchain.chain,
                }),
            });
            } else if (msg.type === "CHAIN_RESPONSE") {
                this.blockchain.replaceChain(msg.chain);
            }

        }
    publish({ channel, message }) {
        this.pubnub.publish({ message, channel });
    }
}