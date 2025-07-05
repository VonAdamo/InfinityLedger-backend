# InfinityLedger Backend

This project is a simple blockchain and wallet API built with **Node.js** and **Express**. It was created as an assignment exploring how a minimal blockchain works together with a REST interface and a small authentication layer.

## Features

- Proof‑of‑work blockchain implementation with mining difficulty and reward settings found in `config/settings.mjs`.
- Transaction pool and wallet logic for signing and verifying transactions.
- JWT based authentication and user management stored in MongoDB.
- PubNub integration used to broadcast blocks and transactions across network nodes.
- Vitest unit tests for the core blockchain models.

## Project Structure

- `server.mjs` – Express entry point and PubNub server setup.
- `auth/` – controllers, routes and models for user registration and login.
- `blockchain/` – blockchain models, controllers, routes and tests.
- `config/` – MongoDB connection and blockchain configuration values.
- `pubnub-server.mjs` – helper used for publishing blockchain updates.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create an environment file with the variables used by the application:
   - `MONGO_URI` – MongoDB connection string
   - `JWT_SECRET` and `JWT_EXPIRE` – JWT configuration
   - `PUBLISH_KEY`, `SUBSCRIBE_KEY`, `SECRET_KEY`, `USER_ID` – PubNub keys
   - `GENERATE_NODE_PORT` (optional) – allows multiple nodes on one machine
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run the tests:
   ```bash
   npm test
   ```

API routes are prefixed with `/api/v1` and include endpoints for blocks, transactions, wallets and authentication. See the `routes` directories for the exact paths and HTTP verbs.

