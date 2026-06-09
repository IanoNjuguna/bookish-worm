# Architecture

Doba utilises Cardano as the settlement layer and IPFS for decentralized storage of metadata and media files.

The entire protocol is composed of a set of on-chain programs and off-chain services.

## On-Chain Programs

* **Unified Multi-Purpose Validators (CIP-69 Standard):** Handles the core minting and spending logic on-chain. The validators are built using Aiken, a domain-specific language for writing Plutus smart contracts on Cardano.

## Off-Chain Services

* **Secure API & Business Logic Layer:** The orchestrator of the protocol. It handles user authentication, business logic, metadata preparation, database state management, and direct communication with decentralised storage and the Cardano blockchain.
* **Transaction Construction Pipeline:** A service that securely builds Cardano transactions based on backend states, passing a raw unsigned transaction hex string back to the frontend for a user signature.
* **Data Indexer:** A service that indexes the Cardano blockchain to provide a clean analytics layer.
* **Frontend:** The user interface for the protocol, providing a seamless experience for artists and collectors.
* **Analytics Portal:** The analytics interface for the marketplace, provides data and insights to artists and collectors.

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [Frontend]
        App[Marketplace & Artist Portal]
        Wallet[User Cardano Wallet]
    end

    %% Backend Layer
    subgraph Backend [Doba Secure Backend]
        API[API Gateway / Business Logic]
        TxPipe[Cardano Tx Builder]
        DB[(Central Database)]
    end

    %% Blockchain
    subgraph Blockchain [Ledger]
        C69Val[Unified CIP-69 Validators]
        Storage[(IPFS Storage)]
    end

    %% Flow Pipeline
    App --> |1. Request Action / Upload Media| API
    API --> |2. Save Metadata| DB
    API --> |3. Push Assets| Storage
    API --> |4. Build EUTxO Transaction| TxPipe
    TxPipe --> |5. Return Unsigned Hex Payload| API
    API --> |6. Send Unsigned Payload| App
    App --> |7. Prompt Signature & Submit| Wallet
    Wallet --> |8. Execute Contract Logic| C69Val
    C69Val --> |9. Sync On-Chain State| API
