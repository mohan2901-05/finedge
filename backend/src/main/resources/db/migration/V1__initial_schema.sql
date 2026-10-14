-- ========================================================================
-- FinEdge Database Schema - Version 1 (Initial Schema)
-- Target: MySQL 8.0+ / RDS MySQL / H2 (MySQL Mode)
-- ========================================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_number VARCHAR(32) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_customers_email UNIQUE (email),
    CONSTRAINT uk_customers_number UNIQUE (customer_number)
);

CREATE INDEX idx_customers_name ON customers (last_name, first_name);
CREATE INDEX idx_customers_status ON customers (status);

-- 2. Accounts Table
-- Relational Rule: ON DELETE RESTRICT prevents accidental deletion of customer with financial accounts
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(34) NOT NULL,
    customer_id BIGINT NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    opened_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_accounts_number UNIQUE (account_number),
    CONSTRAINT fk_accounts_customer FOREIGN KEY (customer_id) 
        REFERENCES customers (id) ON DELETE RESTRICT
);

CREATE INDEX idx_accounts_customer_id ON accounts (customer_id);
CREATE INDEX idx_accounts_type_status ON accounts (account_type, status);

-- 3. Transactions Table
-- Immutable ledger table recording financial movements
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_reference VARCHAR(40) NOT NULL,
    account_id BIGINT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_transactions_ref UNIQUE (transaction_reference),
    CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) 
        REFERENCES accounts (id) ON DELETE RESTRICT
);

CREATE INDEX idx_transactions_account_id ON transactions (account_id);
CREATE INDEX idx_transactions_date ON transactions (transaction_date);
CREATE INDEX idx_transactions_type ON transactions (transaction_type);

-- 4. Loan Applications Table
CREATE TABLE IF NOT EXISTS loan_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(32) NOT NULL,
    customer_id BIGINT NOT NULL,
    loan_type VARCHAR(30) NOT NULL,
    requested_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure_months INT NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    application_date DATE NOT NULL,
    reviewed_by VARCHAR(100),
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_loans_app_number UNIQUE (application_number),
    CONSTRAINT fk_loans_customer FOREIGN KEY (customer_id) 
        REFERENCES customers (id) ON DELETE RESTRICT
);

CREATE INDEX idx_loans_customer_id ON loan_applications (customer_id);
CREATE INDEX idx_loans_status ON loan_applications (status);
CREATE INDEX idx_loans_type ON loan_applications (loan_type);
