package com.finedge.service;

import com.finedge.dto.TransactionCreateRequest;
import com.finedge.dto.TransactionDTO;
import com.finedge.entity.*;
import com.finedge.exception.BusinessRuleException;
import com.finedge.repository.AccountRepository;
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
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    @DisplayName("Should successfully credit deposit and update account balance")
    void createTransaction_Deposit_IncreasesBalance() {
        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("ACCT-001");
        account.setBalance(new BigDecimal("1000.00"));
        account.setStatus(AccountStatus.ACTIVE);

        TransactionCreateRequest request = new TransactionCreateRequest();
        request.setAccountId(1L);
        request.setTransactionType(TransactionType.DEPOSIT);
        request.setAmount(new BigDecimal("500.00"));
        request.setDescription("Payroll bonus");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> {
            Transaction t = i.getArgument(0);
            t.setId(101L);
            return t;
        });

        TransactionDTO dto = transactionService.createTransaction(request);

        assertNotNull(dto);
        assertEquals(new BigDecimal("1500.00"), account.getBalance());
        assertEquals(new BigDecimal("1500.00"), dto.getBalanceAfter());
        verify(accountRepository, times(1)).save(account);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("Should reject debit when requested amount exceeds account balance")
    void createTransaction_InsufficientFunds_ThrowsBusinessRuleException() {
        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("ACCT-001");
        account.setBalance(new BigDecimal("200.00"));
        account.setStatus(AccountStatus.ACTIVE);

        TransactionCreateRequest request = new TransactionCreateRequest();
        request.setAccountId(1L);
        request.setTransactionType(TransactionType.WITHDRAWAL);
        request.setAmount(new BigDecimal("500.00"));
        request.setDescription("ATM withdrawal");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> transactionService.createTransaction(request));
        assertTrue(ex.getMessage().contains("Insufficient funds"));
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject transaction on FROZEN or CLOSED account")
    void createTransaction_FrozenAccount_ThrowsBusinessRuleException() {
        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("ACCT-001");
        account.setBalance(new BigDecimal("2000.00"));
        account.setStatus(AccountStatus.FROZEN);

        TransactionCreateRequest request = new TransactionCreateRequest();
        request.setAccountId(1L);
        request.setTransactionType(TransactionType.PAYMENT);
        request.setAmount(new BigDecimal("50.00"));
        request.setDescription("Bill payment");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));

        assertThrows(BusinessRuleException.class, () -> transactionService.createTransaction(request));
        verify(transactionRepository, never()).save(any());
    }
}
