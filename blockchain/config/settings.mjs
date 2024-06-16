export const MINE_RATE = 1000;
export const STARTING_BACLANCE = 1000;
export const REWARD_ADDRESS = { address: "reward-address" };
export const MINING_REWARD = 50;
export const INITIAL_DIFFICULTY = 2;

export const GENESIS_DATA = {
    timestamp: Date.now(), // timestamp: 1,
    blockIndex: 0,
    lastHash: "0",
    hash: "0",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
};