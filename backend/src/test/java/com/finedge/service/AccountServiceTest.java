package com.finedge.service;

import com.finedge.dto.AccountCreateRequest;
import com.finedge.dto.AccountDTO;
import com.finedge.entity.*;
import com.finedge.exception.BusinessRuleException;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.TransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private AccountService accountService;

    @Test
    @DisplayName("Should create account and automatically log initial deposit transaction")
    void createAccount_WithInitialDeposit_Success() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setFirstName("Eleanor");
        customer.setLastName("Vance");

        AccountCreateRequest request = new AccountCreateRequest();
        request.setCustomerId(1L);
        request.setAccountType(AccountType.CHECKING);
        request.setInitialBalance(new BigDecimal("1500.00"));
        request.setCurrency("USD");
        request.setStatus(AccountStatus.ACTIVE);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account a = invocation.getArgument(0);
            a.setId(50L);
            return a;
        });

        AccountDTO dto = accountService.createAccount(request);

        assertNotNull(dto);
        assertEquals(new BigDecimal("1500.00"), dto.getBalance());
        assertTrue(dto.getAccountNumber().startsWith("ACCT-CHE-"));
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should reject deleting an account that retains a positive balance")
    void deleteAccount_WithBalance_ThrowsBusinessRuleException() {
        Account account = new Account();
        account.setId(5L);
        account.setAccountNumber("ACCT-CHK-1001");
        account.setBalance(new BigDecimal("250.00"));

        when(accountRepository.findById(5L)).thenReturn(Optional.of(account));

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> accountService.deleteAccount(5L));
        assertTrue(ex.getMessage().contains("remaining balance"));
        verify(accountRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should reject deleting an account with existing ledger transactions")
    void deleteAccount_WithTransactions_ThrowsBusinessRuleException() {
        Account account = new Account();
        account.setId(5L);
        account.setAccountNumber("ACCT-CHK-1001");
        account.setBalance(BigDecimal.ZERO);

        when(accountRepository.findById(5L)).thenReturn(Optional.of(account));
        when(transactionRepository.countByAccountId(5L)).thenReturn(12L);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> accountService.deleteAccount(5L));
        assertTrue(ex.getMessage().contains("posted transaction"));
        verify(accountRepository, never()).delete(any());
    }
}
