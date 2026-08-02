# Architecture

Doba utilizes Cardano as the settlement layer and IPFS for decentralized storage of metadata and media files.

The protocol architecture is decoupled into an **API Gateway (Reverse Proxy)** and distinct microservices:

## Off-Chain Microservices & Gateway

* **API Gateway / Reverse Proxy (Go):** The primary ingress listener at port `:8080`. Routes incoming HTTP requests based on host headers:
  - `doba.world` ➔ Reverse proxy to **Home Service** (`HOME_SERVICE_URL`, default `:3001`).
  - `app.doba.world` ➔ Reverse proxy to **App Microservice** (`APP_SERVICE_URL`, default `:3000`).
* **Home Microservice (`frontend/home`):** Handles static, landing page, and marketing interactions (`doba.world`).
* **App Microservice (`frontend/app`):** Next.js powered application handling the Cardano Web3 marketplace, studio portal, and streaming (`app.doba.world`).
* **Transaction Construction Pipeline:** A service that securely builds Cardano transactions based on backend states, passing raw unsigned transaction hex payloads back to the client.
* **Data Indexer:** Indexes the Cardano blockchain to provide an analytics layer.

## On-Chain Programs

* **Unified Multi-Purpose Validators (CIP-69 Standard):** Handles core minting and spending logic on-chain. Validators are built using Aiken for Plutus smart contracts on Cardano.

```mermaid
graph TD
    %% Clients & Gateway
    Client[Client Browser / Wallet] -->|Public Ingress :8080| Gateway[API Gateway / Go Reverse Proxy]

    %% Microservices Layer
    subgraph Microservices [Decoupled Microservices]
        Home[Home Service - doba.world :3001]
        App[App Marketplace Service - app.doba.world :3000]
    end

    %% Gateway Routing
    Gateway -->|doba.world| Home
    Gateway -->|app.doba.world| App

    %% Backend & On-Chain Integrations
    subgraph Backend [Backend Infrastructure]
        TxPipe[Cardano Tx Builder]
        DB[(Central Database)]
    end

    subgraph Blockchain [Ledger & Storage]
        C69Val[CIP-69 Validators]
        Storage[(IPFS Storage)]
    end

    App -->|Upload Media & Build Tx| TxPipe
    TxPipe -->|Build Unsigned Payload| App
    App -->|Sign & Submit| Client
    Client -->|Execute Contract| C69Val
    C69Val -->|Sync State| DB
```
