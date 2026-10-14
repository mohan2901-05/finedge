package com.finedge.controller;

import com.finedge.dto.LoanApplicationDTO;
import com.finedge.dto.PageResponse;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.service.LoanApplicationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LoanApplicationController.class)
class LoanApplicationControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private LoanApplicationService applicationService;

    private LoanApplicationDTO dto(Integer id) {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setId(id);
        dto.setRef("TEST-REF-1");
        dto.setCustomerName("Test Borrower");
        dto.setLoanAmount(new BigDecimal("50000.00"));
        dto.setStatus("Pending Review");
        return dto;
    }

    private String createBody() {
        return "{\"ref\":\"TEST-REF-1\",\"customerName\":\"Test Borrower\","
                + "\"customerPhone\":\"9000000001\",\"customerEmail\":\"a@example.invalid\","
                + "\"customerCity\":\"Test City\",\"customerAddress\":\"1 Test Road\","
                + "\"financierKey\":\"test_fin\",\"financierLabel\":\"Test Finance\","
                + "\"loanAmount\":50000.00,\"tenureMonths\":12,\"interestRate\":12.00,"
                + "\"emi\":1000.00,\"totalInterest\":500.00,\"totalPayable\":50500.00}";
    }

    @Test
    @DisplayName("GET /api/etfdb/loan-applications returns a page")
    void list_ReturnsPage() throws Exception {
        PageResponse<LoanApplicationDTO> page =
                new PageResponse<>(List.of(dto(1)), 0, 10, 1, 1, true, true);
        when(applicationService.list(isNull(), anyInt(), anyInt())).thenReturn(page);

        mvc.perform(get("/api/etfdb/loan-applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].ref").value("TEST-REF-1"));
    }

    @Test
    @DisplayName("GET /api/etfdb/loan-applications/ref/{ref} returns the intake")
    void getByRef_ReturnsDto() throws Exception {
        when(applicationService.getByRef("TEST-REF-1")).thenReturn(dto(1));

        mvc.perform(get("/api/etfdb/loan-applications/ref/TEST-REF-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET unknown intake returns 404")
    void getById_UnknownReturns404() throws Exception {
        when(applicationService.getById(999))
                .thenThrow(new ResourceNotFoundException("Loan application not found with id: 999"));

        mvc.perform(get("/api/etfdb/loan-applications/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/etfdb/loan-applications returns 201 without PAN")
    void create_Returns201WithoutPan() throws Exception {
        when(applicationService.create(any())).thenReturn(dto(7));

        mvc.perform(post("/api/etfdb/loan-applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.customerPan").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/etfdb/loan-applications returns 400 for invalid body")
    void create_InvalidReturns400() throws Exception {
        mvc.perform(post("/api/etfdb/loan-applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ref\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/etfdb/loan-applications/{id} returns 204")
    void delete_Returns204() throws Exception {
        mvc.perform(delete("/api/etfdb/loan-applications/1"))
                .andExpect(status().isNoContent());
    }
}
