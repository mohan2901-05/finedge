package com.finedge.service;

import com.finedge.dto.AccountCreateRequest;
import com.finedge.dto.AccountDTO;
import com.finedge.dto.AccountUpdateRequest;
import com.finedge.dto.PageResponse;
import com.finedge.entity.*;
import com.finedge.exception.BusinessRuleException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository,
                          CustomerRepository customerRepository,
                          TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<AccountDTO> getAccounts(Long customerId, AccountType type, AccountStatus status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Account> accountPage = accountRepository.findAccountsFiltered(customerId, type, status, search, pageable);
        List<AccountDTO> dtos = accountPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return PageResponse.from(accountPage, dtos);
    }

    @Transactional(readOnly = true)
    public AccountDTO getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return mapToDTO(account);
    }

    public AccountDTO createAccount(AccountCreateRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        Account account = new Account();
        String typePrefix = request.getAccountType().name().substring(0, 3);
        String randomSuffix = UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 6);
        account.setAccountNumber("ACCT-" + typePrefix + "-" + randomSuffix);
        account.setCustomer(customer);
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO);
        account.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        account.setStatus(request.getStatus() != null ? request.getStatus() : AccountStatus.ACTIVE);
        account.setOpenedDate(LocalDate.now());

        Account saved = accountRepository.save(account);

        // If an initial deposit was made, record the ledger transaction for full auditability
        if (saved.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            Transaction initialTxn = new Transaction();
            initialTxn.setTransactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            initialTxn.setAccount(saved);
            initialTxn.setTransactionType(TransactionType.DEPOSIT);
            initialTxn.setAmount(saved.getBalance());
            initialTxn.setBalanceAfter(saved.getBalance());
            initialTxn.setDescription("Initial account opening deposit");
            initialTxn.setStatus(TransactionStatus.COMPLETED);
            initialTxn.setTransactionDate(LocalDateTime.now());
            transactionRepository.save(initialTxn);
        }

        return mapToDTO(saved);
    }

    public AccountDTO updateAccount(Long id, AccountUpdateRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        account.setAccountType(request.getAccountType());
        account.setStatus(request.getStatus());

        Account updated = accountRepository.save(account);
        return mapToDTO(updated);
    }

    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        // Strict Financial Audit Rule: Do not drop accounts that contain balance or transaction history
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new BusinessRuleException("Cannot delete account '" + account.getAccountNumber() +
                    "' with a remaining balance of " + account.getCurrency() + " " + account.getBalance() +
                    ". Withdraw or transfer funds to zero balance first.");
        }

        long txnCount = transactionRepository.countByAccountId(id);
        if (txnCount > 0) {
            throw new BusinessRuleException("Cannot delete account '" + account.getAccountNumber() +
                    "' because it contains " + txnCount + " posted transaction record(s). Financial accounts with history must be CLOSED rather than deleted.");
        }

        accountRepository.delete(account);
    }

    public AccountDTO mapToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        if (account.getCustomer() != null) {
            dto.setCustomerId(account.getCustomer().getId());
            dto.setCustomerName(account.getCustomer().getFullName());
            dto.setCustomerEmail(account.getCustomer().getEmail());
        }
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setCurrency(account.getCurrency());
        dto.setStatus(account.getStatus());
        dto.setOpenedDate(account.getOpenedDate());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }
}
