export const MINE_RATE = 1000;
export const STARTING_BALANCE = 1000;
export const REWARD_ADDRESS = { address: "reward-address" };
export const MINING_REWARD = 50;
export const INITIAL_DIFFICULTY = 2;

export const GENESIS_DATA = {
    timestamp: Date.now(),
    lastHash: '0',
    hash: '0',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
    blockIndex: 0,
};