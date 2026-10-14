package com.finedge.service;

import com.finedge.dto.DashboardSummaryDTO;
import com.finedge.dto.TransactionDTO;
import com.finedge.entity.Account;
import com.finedge.entity.AccountStatus;
import com.finedge.entity.AccountType;
import com.finedge.entity.LoanStatus;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.LoanApplicationRepository;
import com.finedge.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public DashboardService(CustomerRepository customerRepository,
                            AccountRepository accountRepository,
                            LoanApplicationRepository loanApplicationRepository,
                            TransactionRepository transactionRepository,
                            TransactionService transactionService) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.loanApplicationRepository = loanApplicationRepository;
        this.transactionRepository = transactionRepository;
        this.transactionService = transactionService;
    }

    public DashboardSummaryDTO getSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTotalCustomers(customerRepository.count());
        summary.setActiveAccounts(accountRepository.countByStatus(AccountStatus.ACTIVE));

        BigDecimal totalBal = accountRepository.sumBalanceByStatus(AccountStatus.ACTIVE);
        summary.setTotalDeposits(totalBal != null ? totalBal : BigDecimal.ZERO);

        summary.setPendingLoans(loanApplicationRepository.countByStatus(LoanStatus.PENDING));
        summary.setApprovedLoans(loanApplicationRepository.countByStatus(LoanStatus.APPROVED));
        summary.setRejectedLoans(loanApplicationRepository.countByStatus(LoanStatus.REJECTED));

        // Distribution of Accounts by Type
        List<Account> allAccounts = accountRepository.findAll();
        Map<String, Long> accountsByType = allAccounts.stream()
                .collect(Collectors.groupingBy(
                        account -> account.getAccountType().name(),
                        LinkedHashMap::new,
                        Collectors.counting()));
        // Ensure all types present even with zero count
        for (AccountType type : AccountType.values()) {
            accountsByType.putIfAbsent(type.name(), 0L);
        }
        summary.setAccountsByType(accountsByType);

        // Distribution of Loans by Status
        Map<String, Long> loansByStatus = new LinkedHashMap<>();
        loansByStatus.put("PENDING", summary.getPendingLoans());
        loansByStatus.put("APPROVED", summary.getApprovedLoans());
        loansByStatus.put("REJECTED", summary.getRejectedLoans());
        summary.setLoansByStatus(loansByStatus);

        // Monthly transaction volume (grouping recent transactions by month/year)
        DateTimeFormatter monthFormat = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, BigDecimal> monthlyVolume = transactionRepository.findAll().stream()
                .sorted((t1, t2) -> t1.getTransactionDate().compareTo(t2.getTransactionDate()))
                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().format(monthFormat),
                        LinkedHashMap::new,
                        Collectors.mapping(
                                t -> t.getAmount(),
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
        summary.setMonthlyVolume(monthlyVolume);

        return summary;
    }

    public List<TransactionDTO> getRecentTransactions() {
        return transactionService.getRecentTransactions();
    }
}
