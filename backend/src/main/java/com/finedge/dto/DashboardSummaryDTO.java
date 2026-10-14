package com.finedge.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardSummaryDTO {
    private long totalCustomers;
    private long activeAccounts;
    private BigDecimal totalDeposits;
    private long pendingLoans;
    private long approvedLoans;
    private long rejectedLoans;
    private Map<String, Long> accountsByType;
    private Map<String, Long> loansByStatus;
    private Map<String, BigDecimal> monthlyVolume;

    public DashboardSummaryDTO() {
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getActiveAccounts() {
        return activeAccounts;
    }

    public void setActiveAccounts(long activeAccounts) {
        this.activeAccounts = activeAccounts;
    }

    public BigDecimal getTotalDeposits() {
        return totalDeposits;
    }

    public void setTotalDeposits(BigDecimal totalDeposits) {
        this.totalDeposits = totalDeposits;
    }

    public long getPendingLoans() {
        return pendingLoans;
    }

    public void setPendingLoans(long pendingLoans) {
        this.pendingLoans = pendingLoans;
    }

    public long getApprovedLoans() {
        return approvedLoans;
    }

    public void setApprovedLoans(long approvedLoans) {
        this.approvedLoans = approvedLoans;
    }

    public long getRejectedLoans() {
        return rejectedLoans;
    }

    public void setRejectedLoans(long rejectedLoans) {
        this.rejectedLoans = rejectedLoans;
    }

    public Map<String, Long> getAccountsByType() {
        return accountsByType;
    }

    public void setAccountsByType(Map<String, Long> accountsByType) {
        this.accountsByType = accountsByType;
    }

    public Map<String, Long> getLoansByStatus() {
        return loansByStatus;
    }

    public void setLoansByStatus(Map<String, Long> loansByStatus) {
        this.loansByStatus = loansByStatus;
    }

    public Map<String, BigDecimal> getMonthlyVolume() {
        return monthlyVolume;
    }

    public void setMonthlyVolume(Map<String, BigDecimal> monthlyVolume) {
        this.monthlyVolume = monthlyVolume;
    }
}
