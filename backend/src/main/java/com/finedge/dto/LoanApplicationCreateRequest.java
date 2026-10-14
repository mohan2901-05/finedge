package com.finedge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanApplicationCreateRequest {

    @NotBlank(message = "Reference is required")
    @Size(max = 50, message = "Reference must be at most 50 characters")
    private String ref;

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must be at most 100 characters")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    @Size(max = 15, message = "Customer phone must be at most 15 characters")
    private String customerPhone;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email must be a valid format")
    @Size(max = 100, message = "Customer email must be at most 100 characters")
    private String customerEmail;

    private LocalDate customerDob;

    @Size(max = 20, message = "PAN number must be at most 20 characters")
    private String customerPan;

    @NotBlank(message = "Customer city is required")
    @Size(max = 100, message = "Customer city must be at most 100 characters")
    private String customerCity;

    @NotBlank(message = "Customer address is required")
    @Size(max = 255, message = "Customer address must be at most 255 characters")
    private String customerAddress;

    @NotBlank(message = "Financier key is required")
    @Size(max = 50, message = "Financier key must be at most 50 characters")
    private String financierKey;

    @NotBlank(message = "Financier label is required")
    @Size(max = 100, message = "Financier label must be at most 100 characters")
    private String financierLabel;

    @NotNull(message = "Loan amount is required")
    private BigDecimal loanAmount;

    @NotNull(message = "Tenure in months is required")
    private Integer tenureMonths;

    @NotNull(message = "Interest rate is required")
    private BigDecimal interestRate;

    @NotNull(message = "EMI is required")
    private BigDecimal emi;

    @NotNull(message = "Total interest is required")
    private BigDecimal totalInterest;

    @NotNull(message = "Total payable is required")
    private BigDecimal totalPayable;

    @Size(max = 30, message = "Status must be at most 30 characters")
    private String status;

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public LocalDate getCustomerDob() {
        return customerDob;
    }

    public void setCustomerDob(LocalDate customerDob) {
        this.customerDob = customerDob;
    }

    public String getCustomerPan() {
        return customerPan;
    }

    public void setCustomerPan(String customerPan) {
        this.customerPan = customerPan;
    }

    public String getCustomerCity() {
        return customerCity;
    }

    public void setCustomerCity(String customerCity) {
        this.customerCity = customerCity;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getFinancierKey() {
        return financierKey;
    }

    public void setFinancierKey(String financierKey) {
        this.financierKey = financierKey;
    }

    public String getFinancierLabel() {
        return financierLabel;
    }

    public void setFinancierLabel(String financierLabel) {
        this.financierLabel = financierLabel;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public BigDecimal getEmi() {
        return emi;
    }

    public void setEmi(BigDecimal emi) {
        this.emi = emi;
    }

    public BigDecimal getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(BigDecimal totalInterest) {
        this.totalInterest = totalInterest;
    }

    public BigDecimal getTotalPayable() {
        return totalPayable;
    }

    public void setTotalPayable(BigDecimal totalPayable) {
        this.totalPayable = totalPayable;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
