# Ledger / Wallet Service – Assignment

Build a **Ledger / Wallet Service** in **NestJS** with two endpoints:

- `POST /wallet/transaction` → record a new transaction.  

---

## Requirements

- **Transactions & Ledger**  
  - Record each transaction with `transactionId`, `type`, `amount`, `currency`, and `createdAt`.  
  - Positive amounts increase balance, negative amounts decrease balance.  
  - Balance must **never go negative** (reject if insufficient funds).  
  - All transactions are **append-only** (cannot be updated or deleted).  

- **Currency Handling**  
  - Internally store all amounts in **EGP**.  
  - If a different currency is provided, you can use a **mock conversion service** before saving.  

- **Atomicity**  
  - All transactions must be **atomic** (balance should always remain consistent even under concurrent requests).  

- **Idempotency**  
  - If the same `transactionId` is sent more than once, process it **only once**.  

---

## Testing Expectations

Write tests to cover at least:  
- Deposit increases balance.  
- Withdrawal decreases balance and fails if it would go negative.  
- Multiple concurrent transactions keep the balance consistent.  
- Idempotent transaction does not duplicate effects.  

---
## How to run the application?

### Prerequisites
* Docker

### Building and Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Elkelany/ledger-task.git
   ```

2. **Installation:**
    ```bash
    cd ledger-task
    npm install
    ```

3. **Add environment variables:**

   Create a `.env` file at the root of the project:
    ```
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_USERNAME=nzmly_user
    DATABASE_PASSWORD=nzmly_password
    DATABASE_NAME=nzmly
   ```

4. **Run the Docker container to spin up MySQL:**
   ```bash
   docker compose up -d --build
   ```

5. **Run the application:**
   ```bash
   npm run start:dev
   ```
   The server will run on http://localhost:3000
