package com.finedge.service;

import com.finedge.dto.PageResponse;
import com.finedge.dto.TransactionCreateRequest;
import com.finedge.dto.TransactionDTO;
import com.finedge.entity.*;
import com.finedge.exception.BusinessRuleException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionDTO> getTransactions(Long accountId, TransactionType type, TransactionStatus status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<Transaction> txnPage = transactionRepository.findTransactionsFiltered(accountId, type, status, search, pageable);
        List<TransactionDTO> dtos = txnPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return PageResponse.from(txnPage, dtos);
    }

    @Transactional(readOnly = true)
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToDTO(transaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getRecentTransactions() {
        return transactionRepository.findTop10ByOrderByTransactionDateDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO createTransaction(TransactionCreateRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessRuleException("Cannot post transaction to account '" + account.getAccountNumber() +
                    "' with status " + account.getStatus() + ". Only ACTIVE accounts can process transactions.");
        }

        BigDecimal currentBalance = account.getBalance();
        BigDecimal txnAmount = request.getAmount();
        BigDecimal newBalance;

        boolean isDebit = request.getTransactionType() == TransactionType.WITHDRAWAL
                || request.getTransactionType() == TransactionType.PAYMENT
                || request.getTransactionType() == TransactionType.FEE
                || request.getTransactionType() == TransactionType.TRANSFER_OUT;

        if (isDebit) {
            if (currentBalance.compareTo(txnAmount) < 0) {
                throw new BusinessRuleException("Insufficient funds. Account balance is " +
                        account.getCurrency() + " " + currentBalance + ", requested debit is " + txnAmount);
            }
            newBalance = currentBalance.subtract(txnAmount);
        } else {
            // Credit (DEPOSIT, TRANSFER_IN)
            newBalance = currentBalance.add(txnAmount);
        }

        // Update account balance
        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setTransactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        txn.setAccount(account);
        txn.setTransactionType(request.getTransactionType());
        txn.setAmount(txnAmount);
        txn.setBalanceAfter(newBalance);
        txn.setDescription(request.getDescription().trim());
        txn.setStatus(TransactionStatus.COMPLETED);
        txn.setTransactionDate(LocalDateTime.now());

        Transaction saved = transactionRepository.save(txn);
        return mapToDTO(saved);
    }

    public TransactionDTO updateTransaction(Long id, String description, TransactionStatus status) {
        Transaction txn = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        // Note: Financial integrity rule: transaction amount and type are immutable.
        // Description and status updates are provided strictly for demonstration and testing records.
        if (description != null && !description.isBlank()) {
            txn.setDescription(description.trim());
        }
        if (status != null) {
            txn.setStatus(status);
        }

        Transaction updated = transactionRepository.save(txn);
        return mapToDTO(updated);
    }

    public void deleteTransaction(Long id) {
        Transaction txn = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        // Demonstration safety note: Real financial systems do not delete ledger entries.
        // This endpoint supports demonstration data reset only.
        transactionRepository.delete(txn);
    }

    public TransactionDTO mapToDTO(Transaction txn) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(txn.getId());
        dto.setTransactionReference(txn.getTransactionReference());
        if (txn.getAccount() != null) {
            dto.setAccountId(txn.getAccount().getId());
            dto.setAccountNumber(txn.getAccount().getAccountNumber());
            if (txn.getAccount().getCustomer() != null) {
                dto.setCustomerName(txn.getAccount().getCustomer().getFullName());
            }
        }
        dto.setTransactionType(txn.getTransactionType());
        dto.setAmount(txn.getAmount());
        dto.setBalanceAfter(txn.getBalanceAfter());
        dto.setDescription(txn.getDescription());
        dto.setStatus(txn.getStatus());
        dto.setTransactionDate(txn.getTransactionDate());
        dto.setCreatedAt(txn.getCreatedAt());
        return dto;
    }
}
