# FinEdge REST API Guide & cURL / Postman Reference

Base URL (Local): `http://localhost:8080/api`

---

## 1. Dashboard

### A. Get Summary Metrics
```bash
curl -X GET "http://localhost:8080/api/dashboard/summary" -H "Accept: application/json"
```
**Expected Status**: `200 OK`
```json
{
  "totalCustomers": 7,
  "activeAccounts": 10,
  "totalDeposits": 704462.50,
  "pendingLoans": 3,
  "approvedLoans": 3,
  "rejectedLoans": 1,
  "accountsByType": {
    "CHECKING": 6,
    "SAVINGS": 4,
    "BUSINESS": 1,
    "MONEY_MARKET": 1
  },
  "loansByStatus": {
    "PENDING": 3,
    "APPROVED": 3,
    "REJECTED": 1
  },
  "monthlyVolume": {
    "Feb 2025": 160949.25,
    "Mar 2025": 21850.00
  }
}
```

### B. Get Recent Transactions
```bash
curl -X GET "http://localhost:8080/api/dashboard/recent-transactions" -H "Accept: application/json"
```
**Expected Status**: `200 OK`

---

## 2. Customer Management

### A. List Customers (Paginated & Searchable)
```bash
curl -X GET "http://localhost:8080/api/customers?search=Marcus&page=0&size=10"
```
**Expected Status**: `200 OK`
```json
{
  "content": [
    {
      "id": 2,
      "customerNumber": "CUST-1002",
      "firstName": "Marcus",
      "lastName": "Chen",
      "fullName": "Marcus Chen",
      "email": "marcus.chen@example.com",
      "phone": "+1-555-0102",
      "city": "San Francisco",
      "state": "CA",
      "status": "ACTIVE",
      "accountCount": 2
    }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### B. Get Customer By ID
```bash
curl -X GET "http://localhost:8080/api/customers/1"
```
**Expected Status**: `200 OK` (or `404 Not Found` if missing)

### C. Create Customer
```bash
curl -X POST "http://localhost:8080/api/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Harper",
    "lastName": "Reed",
    "email": "harper.reed@example.com",
    "phone": "+1-555-0199",
    "address": "100 Pine Street",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98101",
    "status": "ACTIVE"
  }'
```
**Expected Status**: `201 Created`
**Validation Error Status**: `400 Bad Request`
**Duplicate Email Status**: `409 Conflict`

### D. Update Customer
```bash
curl -X PUT "http://localhost:8080/api/customers/1" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Eleanor",
    "lastName": "Vance-Smith",
    "email": "eleanor.vance@example.com",
    "phone": "+1-555-0101",
    "address": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62704",
    "status": "ACTIVE"
  }'
```
**Expected Status**: `200 OK`

### E. Delete Customer
```bash
curl -X DELETE "http://localhost:8080/api/customers/6"
```
**Expected Status**:
- `204 No Content` if customer has no accounts or loans.
- `409 Conflict` or `400 Bad Request` if customer possesses financial accounts or loans.

---

## 3. Account Management

### A. List Accounts
```bash
curl -X GET "http://localhost:8080/api/accounts?customerId=1&page=0&size=10"
```
**Expected Status**: `200 OK`

### B. Create Account
```bash
curl -X POST "http://localhost:8080/api/accounts" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "accountType": "CHECKING",
    "initialBalance": 2500.00,
    "currency": "USD",
    "status": "ACTIVE"
  }'
```
**Expected Status**: `201 Created` (automatically logs opening deposit ledger transaction)

### C. Update Account
```bash
curl -X PUT "http://localhost:8080/api/accounts/1" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "CHECKING",
    "status": "FROZEN"
  }'
```
**Expected Status**: `200 OK`

### D. Delete Account
```bash
curl -X DELETE "http://localhost:8080/api/accounts/1"
```
**Expected Status**: `400 Bad Request` if balance > 0 or has transaction history.

---

## 4. Transaction Management

### A. List Transactions
```bash
curl -X GET "http://localhost:8080/api/transactions?accountId=1&page=0&size=10"
```
**Expected Status**: `200 OK`

### B. Post New Transaction
```bash
curl -X POST "http://localhost:8080/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "transactionType": "DEPOSIT",
    "amount": 1200.00,
    "description": "Invoice compensation"
  }'
```
**Expected Status**: `201 Created` (Updates account balance atomically)

---

## 5. Loan Application Management

### A. List Loans
```bash
curl -X GET "http://localhost:8080/api/loans?status=PENDING&page=0&size=10"
```
**Expected Status**: `200 OK`

### B. Submit Loan Application
```bash
curl -X POST "http://localhost:8080/api/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "loanType": "BUSINESS",
    "requestedAmount": 75000.00,
    "interestRate": 6.85,
    "tenureMonths": 48,
    "purpose": "Inventory scaling and logistics"
  }'
```
**Expected Status**: `201 Created`

### C. Underwrite / Update Loan Application Status
```bash
curl -X PUT "http://localhost:8080/api/loans/3" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "APPROVED",
    "reviewedBy": "Senior Underwriter James Cole"
  }'
```
**Expected Status**: `200 OK`
