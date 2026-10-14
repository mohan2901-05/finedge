# FinEdge Database Schema Specification

## 1. Relational ER Overview

The FinEdge system uses a normalized relational schema with explicit deletion prevention and foreign key integrity.

```
       +-----------------------+
       |       customers       |
       +-----------------------+
       | PK  id                |
       | UQ  customer_number   |
       | UQ  email             |
       |     phone             |
       |     ...               |
       +-----------+-----------+
                   |
         1:N (ON DELETE RESTRICT)
                   |
         +---------+---------+
         |                   |
         v                   v
+-----------------+ +-------------------+
|    accounts     | | loan_applications |
+-----------------+ +-------------------+
| PK  id          | | PK  id            |
| UQ  account_num | | UQ  app_number    |
| FK  customer_id | | FK  customer_id   |
|     balance     | |     req_amount    |
|     status      | |     status        |
+--------+--------+ +-------------------+
         |
  1:N (ON DELETE RESTRICT)
         |
         v
+-----------------------+
|     transactions      |
+-----------------------+
| PK  id                |
| UQ  transaction_ref   |
| FK  account_id        |
|     amount            |
|     balance_after     |
|     status            |
+-----------------------+
```

## 2. Table Specifications

### A. `customers`
- **`id`** (`BIGINT AUTO_INCREMENT PRIMARY KEY`): Surrogate primary key.
- **`customer_number`** (`VARCHAR(32) NOT NULL UNIQUE`): Business identifier (e.g. `CUST-1001`).
- **`first_name`**, **`last_name`** (`VARCHAR(50) NOT NULL`): Customer personal identification.
- **`email`** (`VARCHAR(100) NOT NULL UNIQUE`): Unique email address, index accelerated.
- **`phone`** (`VARCHAR(25) NOT NULL`): Contact phone number.
- **`address`**, **`city`**, **`state`**, **`postal_code`**: Structured address fields.
- **`status`** (`VARCHAR(20) NOT NULL`): `ACTIVE`, `INACTIVE`, `SUSPENDED`.
- **`created_at`**, **`updated_at`** (`TIMESTAMP NOT NULL`).

### B. `accounts`
- **`id`** (`BIGINT AUTO_INCREMENT PRIMARY KEY`).
- **`account_number`** (`VARCHAR(34) NOT NULL UNIQUE`): Unique account identifier (e.g. `ACCT-CHK-100101`).
- **`customer_id`** (`BIGINT NOT NULL`): Foreign key referencing `customers(id)`.
- **`account_type`** (`VARCHAR(30) NOT NULL`): `CHECKING`, `SAVINGS`, `BUSINESS`, `MONEY_MARKET`.
- **`balance`** (`DECIMAL(15, 2) NOT NULL`): Accurate monetary balance.
- **`currency`** (`VARCHAR(3) NOT NULL DEFAULT 'USD'`).
- **`status`** (`VARCHAR(20) NOT NULL`): `ACTIVE`, `DORMANT`, `FROZEN`, `CLOSED`.
- **`opened_date`** (`DATE NOT NULL`).
- **Foreign Key Constraint**: `fk_accounts_customer` on `customer_id` with `ON DELETE RESTRICT`.

### C. `transactions`
- **`id`** (`BIGINT AUTO_INCREMENT PRIMARY KEY`).
- **`transaction_reference`** (`VARCHAR(40) NOT NULL UNIQUE`): Unique idempotency reference (e.g. `TXN-901001`).
- **`account_id`** (`BIGINT NOT NULL`): Foreign key referencing `accounts(id)`.
- **`transaction_type`** (`VARCHAR(20) NOT NULL`): `DEPOSIT`, `WITHDRAWAL`, `TRANSFER_IN`, `TRANSFER_OUT`, `PAYMENT`, `FEE`.
- **`amount`** (`DECIMAL(15, 2) NOT NULL`): Positive transactional magnitude.
- **`balance_after`** (`DECIMAL(15, 2) NOT NULL`): Snapshot balance after posting.
- **`description`** (`VARCHAR(255) NOT NULL`): Narrative memo for statement.
- **`status`** (`VARCHAR(20) NOT NULL DEFAULT 'COMPLETED'`): `COMPLETED`, `PENDING`, `FAILED`, `REVERSED`.
- **`transaction_date`** (`TIMESTAMP NOT NULL`).
- **Foreign Key Constraint**: `fk_transactions_account` with `ON DELETE RESTRICT`.

### D. `loan_applications`
- **`id`** (`BIGINT AUTO_INCREMENT PRIMARY KEY`).
- **`application_number`** (`VARCHAR(32) NOT NULL UNIQUE`): Application identifier (e.g. `LN-2025-0010`).
- **`customer_id`** (`BIGINT NOT NULL`): Reference to applicant `customers(id)`.
- **`loan_type`** (`VARCHAR(30) NOT NULL`): `PERSONAL`, `MORTGAGE`, `AUTO`, `BUSINESS`, `EDUCATION`.
- **`requested_amount`** (`DECIMAL(15, 2) NOT NULL`).
- **`interest_rate`** (`DECIMAL(5, 2) NOT NULL`): Annual percentage rate.
- **`tenure_months`** (`INT NOT NULL`): Repayment duration in months.
- **`purpose`** (`VARCHAR(255) NOT NULL`): Loan statement purpose.
- **`status`** (`VARCHAR(20) NOT NULL DEFAULT 'PENDING'`): `PENDING`, `APPROVED`, `REJECTED`.
- **`application_date`** (`DATE NOT NULL`).
- **`reviewed_by`** (`VARCHAR(100)`): Underwriter identifier.
- **`rejection_reason`** (`VARCHAR(255)`): Stated risk reason if rejected.

## 3. Data Integrity & Financial Deletion Policies

1. **Anti-Cascade Financial Preservation**:
   - Customers with associated accounts or loan applications cannot be deleted (`ON DELETE RESTRICT`). The application service returns a `409 Conflict` HTTP status code if attempted.
   - Accounts with existing ledger transactions cannot be deleted.
2. **Demonstration Safety**:
   - Real banking transactions are immutable. The demo portal provides simulated administrative creation and management but documents that production accounting forbids ledger mutation without reversal entries.
