-- ========================================================================
-- FinEdge Database Schema - Version 2 (Seed Demonstration Data)
-- Fictional, realistic corporate and individual banking demo data
-- ========================================================================

-- 1. Insert Customers
INSERT INTO customers (id, customer_number, first_name, last_name, email, phone, address, city, state, postal_code, status, created_at, updated_at) VALUES
(1, 'CUST-1001', 'Eleanor', 'Vance', 'eleanor.vance@example.com', '+1-555-0101', '742 Evergreen Terrace', 'Springfield', 'IL', '62704', 'ACTIVE', '2025-01-15 09:30:00', '2025-01-15 09:30:00'),
(2, 'CUST-1002', 'Marcus', 'Chen', 'marcus.chen@example.com', '+1-555-0102', '1204 Market Street, Suite 400', 'San Francisco', 'CA', '94102', 'ACTIVE', '2025-01-18 10:15:00', '2025-01-18 10:15:00'),
(3, 'CUST-1003', 'Sophia', 'Rodriguez', 'sophia.rodriguez@example.com', '+1-555-0103', '88 Biscayne Boulevard', 'Miami', 'FL', '33132', 'ACTIVE', '2025-02-01 14:00:00', '2025-02-01 14:00:00'),
(4, 'CUST-1004', 'David', 'Kim', 'david.kim@example.com', '+1-555-0104', '450 Michigan Avenue', 'Chicago', 'IL', '60611', 'ACTIVE', '2025-02-10 11:45:00', '2025-02-10 11:45:00'),
(5, 'CUST-1005', 'Amara', 'Okonkwo', 'amara.okonkwo@example.com', '+1-555-0105', '310 Peachtree Street NE', 'Atlanta', 'GA', '30308', 'ACTIVE', '2025-02-20 16:20:00', '2025-02-20 16:20:00'),
(6, 'CUST-1006', 'Liam', 'Gallagher', 'liam.gallagher@example.com', '+1-555-0106', '19 Boylston Street', 'Boston', 'MA', '02116', 'INACTIVE', '2025-03-01 08:30:00', '2025-03-01 08:30:00'),
(7, 'CUST-1007', 'Zoe', 'Kowalski', 'zoe.kowalski@example.com', '+1-555-0107', '500 Pike Street', 'Seattle', 'WA', '98101', 'ACTIVE', '2025-03-12 13:10:00', '2025-03-12 13:10:00');

-- 2. Insert Accounts
INSERT INTO accounts (id, account_number, customer_id, account_type, balance, currency, status, opened_date, created_at, updated_at) VALUES
(1, 'ACCT-CHK-100101', 1, 'CHECKING', 14250.75, 'USD', 'ACTIVE', '2025-01-16', '2025-01-16 10:00:00', '2025-01-16 10:00:00'),
(2, 'ACCT-SAV-100102', 1, 'SAVINGS', 85400.00, 'USD', 'ACTIVE', '2025-01-20', '2025-01-20 11:30:00', '2025-01-20 11:30:00'),
(3, 'ACCT-BIZ-100201', 2, 'BUSINESS', 312890.50, 'USD', 'ACTIVE', '2025-01-19', '2025-01-19 09:00:00', '2025-01-19 09:00:00'),
(4, 'ACCT-CHK-100202', 2, 'CHECKING', 24150.00, 'USD', 'ACTIVE', '2025-01-22', '2025-01-22 14:15:00', '2025-01-22 14:15:00'),
(5, 'ACCT-SAV-100301', 3, 'SAVINGS', 46300.25, 'USD', 'ACTIVE', '2025-02-02', '2025-02-02 15:45:00', '2025-02-02 15:45:00'),
(6, 'ACCT-MM-100401', 4, 'MONEY_MARKET', 125000.00, 'USD', 'ACTIVE', '2025-02-12', '2025-02-12 10:30:00', '2025-02-12 10:30:00'),
(7, 'ACCT-CHK-100402', 4, 'CHECKING', 8920.80, 'USD', 'ACTIVE', '2025-02-15', '2025-02-15 11:00:00', '2025-02-15 11:00:00'),
(8, 'ACCT-CHK-100501', 5, 'CHECKING', 19450.00, 'USD', 'ACTIVE', '2025-02-21', '2025-02-21 16:45:00', '2025-02-21 16:45:00'),
(9, 'ACCT-SAV-100502', 5, 'SAVINGS', 62100.00, 'USD', 'ACTIVE', '2025-02-25', '2025-02-25 09:20:00', '2025-02-25 09:20:00'),
(10, 'ACCT-CHK-100601', 6, 'CHECKING', 1200.00, 'USD', 'DORMANT', '2025-03-02', '2025-03-02 10:00:00', '2025-03-02 10:00:00'),
(11, 'ACCT-SAV-100701', 7, 'SAVINGS', 54800.90, 'USD', 'ACTIVE', '2025-03-14', '2025-03-14 14:10:00', '2025-03-14 14:10:00');

-- 3. Insert Transactions
INSERT INTO transactions (id, transaction_reference, account_id, transaction_type, amount, balance_after, description, status, transaction_date, created_at) VALUES
(1, 'TXN-901001', 1, 'DEPOSIT', 5000.00, 15000.00, 'Initial direct payroll deposit', 'COMPLETED', '2025-02-01 09:00:00', '2025-02-01 09:00:00'),
(2, 'TXN-901002', 1, 'PAYMENT', 749.25, 14250.75, 'Utility bill payment - Electric Co', 'COMPLETED', '2025-02-05 14:30:00', '2025-02-05 14:30:00'),
(3, 'TXN-901003', 2, 'DEPOSIT', 25000.00, 85400.00, 'Treasury bond coupon disbursement', 'COMPLETED', '2025-02-10 10:15:00', '2025-02-10 10:15:00'),
(4, 'TXN-901004', 3, 'DEPOSIT', 75000.00, 312890.50, 'Client enterprise contract retainer', 'COMPLETED', '2025-02-15 11:20:00', '2025-02-15 11:20:00'),
(5, 'TXN-901005', 3, 'WITHDRAWAL', 15200.00, 297690.50, 'Payroll distribution batch #24', 'COMPLETED', '2025-02-18 17:00:00', '2025-02-18 17:00:00'),
(6, 'TXN-901006', 4, 'DEPOSIT', 12000.00, 24150.00, 'Consulting invoice receipt #8812', 'COMPLETED', '2025-02-20 13:45:00', '2025-02-20 13:45:00'),
(7, 'TXN-901007', 5, 'TRANSFER_IN', 8000.00, 46300.25, 'Internal fund transfer from checking', 'COMPLETED', '2025-02-22 15:10:00', '2025-02-22 15:10:00'),
(8, 'TXN-901008', 6, 'DEPOSIT', 25000.00, 125000.00, 'Liquidity reserve allocation', 'COMPLETED', '2025-02-25 10:00:00', '2025-02-25 10:00:00'),
(9, 'TXN-901009', 7, 'WITHDRAWAL', 1500.00, 8920.80, 'ATM withdrawal - Downtown branch', 'COMPLETED', '2025-03-01 12:15:00', '2025-03-01 12:15:00'),
(10, 'TXN-901010', 8, 'PAYMENT', 350.00, 19450.00, 'Broadband business service renewal', 'COMPLETED', '2025-03-05 16:30:00', '2025-03-05 16:30:00'),
(11, 'TXN-901011', 9, 'DEPOSIT', 15000.00, 62100.00, 'Quarterly investment dividend', 'COMPLETED', '2025-03-08 09:45:00', '2025-03-08 09:45:00'),
(12, 'TXN-901012', 11, 'DEPOSIT', 5000.00, 54800.90, 'Monthly automated savings deposit', 'COMPLETED', '2025-03-15 08:00:00', '2025-03-15 08:00:00');

-- 4. Insert Loan Applications
INSERT INTO loan_applications (id, application_number, customer_id, loan_type, requested_amount, interest_rate, tenure_months, purpose, status, application_date, reviewed_by, rejection_reason, created_at, updated_at) VALUES
(1, 'LN-2025-0010', 1, 'MORTGAGE', 350000.00, 5.75, 360, 'Primary residential home purchase', 'APPROVED', '2025-01-25', 'Senior Underwriter Sarah Jenkins', NULL, '2025-01-25 10:00:00', '2025-01-27 15:30:00'),
(2, 'LN-2025-0011', 2, 'BUSINESS', 150000.00, 7.25, 60, 'Commercial equipment lease and operational expansion', 'APPROVED', '2025-02-05', 'Commercial Lending Officer Robert Wu', NULL, '2025-02-05 11:30:00', '2025-02-08 14:00:00'),
(3, 'LN-2025-0012', 3, 'PERSONAL', 25000.00, 8.50, 36, 'Home energy efficiency renovation', 'PENDING', '2025-03-01', NULL, NULL, '2025-03-01 09:15:00', '2025-03-01 09:15:00'),
(4, 'LN-2025-0013', 4, 'AUTO', 45000.00, 6.10, 48, 'Electric vehicle financing', 'PENDING', '2025-03-05', NULL, NULL, '2025-03-05 14:20:00', '2025-03-05 14:20:00'),
(5, 'LN-2025-0014', 5, 'EDUCATION', 35000.00, 4.90, 60, 'Executive graduate certificate tuition', 'APPROVED', '2025-03-08', 'Underwriting Team Lead', NULL, '2025-03-08 10:45:00', '2025-03-10 16:00:00'),
(6, 'LN-2025-0015', 6, 'PERSONAL', 60000.00, 9.20, 24, 'Debt consolidation request', 'REJECTED', '2025-03-10', 'Risk Assessment Officer', 'Customer account dormant with insufficient credit history', '2025-03-10 11:00:00', '2025-03-11 09:30:00'),
(7, 'LN-2025-0016', 7, 'MORTGAGE', 520000.00, 5.50, 360, 'Condominium purchase in metropolitan core', 'PENDING', '2025-03-15', NULL, NULL, '2025-03-15 13:00:00', '2025-03-15 13:00:00');
