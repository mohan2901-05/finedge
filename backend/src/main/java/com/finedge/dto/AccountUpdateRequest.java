package com.finedge.dto;

import com.finedge.entity.AccountStatus;
import com.finedge.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public class AccountUpdateRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotNull(message = "Status is required")
    private AccountStatus status;

    public AccountUpdateRequest() {
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }
}
