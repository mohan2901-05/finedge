package com.finedge.integration;

import com.finedge.entity.Customer;
import com.finedge.entity.CustomerStatus;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.LoanApplicationRepository;
import com.finedge.repository.TransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DatabaseMigrationAndRepositoryIntegrationTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;

    @Test
    @DisplayName("Flyway migrations V1 & V2 should have seeded initial demonstration data")
    void flyway_Migrations_SeedData_LoadedSuccessfully() {
        long customerCount = customerRepository.count();
        long accountCount = accountRepository.count();
        long txnCount = transactionRepository.count();
        long loanCount = loanApplicationRepository.count();

        assertTrue(customerCount >= 7, "Expected at least 7 seeded customers from V2 migration");
        assertTrue(accountCount >= 11, "Expected at least 11 seeded accounts from V2 migration");
        assertTrue(txnCount >= 12, "Expected at least 12 seeded transactions from V2 migration");
        assertTrue(loanCount >= 7, "Expected at least 7 seeded loan applications from V2 migration");
    }

    @Test
    @DisplayName("Customer search repository query should filter by query string")
    void customerSearch_FiltersCorrectly() {
        Page<Customer> searchResult = customerRepository.searchCustomers("Marcus", PageRequest.of(0, 5));
        assertEquals(1, searchResult.getTotalElements());
        assertEquals("Marcus", searchResult.getContent().get(0).getFirstName());
    }

    @Test
    @DisplayName("Unique email constraint should be queryable")
    void customerByEmail_Lookup() {
        Optional<Customer> found = customerRepository.findByEmail("eleanor.vance@example.com");
        assertTrue(found.isPresent());
        assertEquals(CustomerStatus.ACTIVE, found.get().getStatus());
    }
}
