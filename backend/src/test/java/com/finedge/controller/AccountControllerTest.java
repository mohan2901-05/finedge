package com.finedge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finedge.dto.AccountCreateRequest;
import com.finedge.dto.AccountDTO;
import com.finedge.entity.AccountStatus;
import com.finedge.entity.AccountType;
import com.finedge.exception.GlobalExceptionHandler;
import com.finedge.service.AccountService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AccountController.class)
@Import(GlobalExceptionHandler.class)
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AccountService accountService;

    @Test
    @DisplayName("POST /api/accounts returns 400 BAD REQUEST when initial balance is negative")
    void createAccount_NegativeBalance_Returns400() throws Exception {
        AccountCreateRequest request = new AccountCreateRequest();
        request.setCustomerId(1L);
        request.setAccountType(AccountType.CHECKING);
        request.setInitialBalance(new BigDecimal("-100.00"));

        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.initialBalance").exists());
    }

    @Test
    @DisplayName("POST /api/accounts returns 201 CREATED for valid account opening")
    void createAccount_Valid_Returns201() throws Exception {
        AccountCreateRequest request = new AccountCreateRequest();
        request.setCustomerId(1L);
        request.setAccountType(AccountType.SAVINGS);
        request.setInitialBalance(new BigDecimal("500.00"));

        AccountDTO dto = new AccountDTO();
        dto.setId(10L);
        dto.setAccountNumber("ACCT-SAV-982103");
        dto.setBalance(new BigDecimal("500.00"));
        dto.setStatus(AccountStatus.ACTIVE);

        when(accountService.createAccount(any())).thenReturn(dto);

        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.balance").value(500.00));
    }
}
