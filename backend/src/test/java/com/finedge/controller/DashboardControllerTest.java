package com.finedge.controller;

import com.finedge.dto.DashboardSummaryDTO;
import com.finedge.exception.GlobalExceptionHandler;
import com.finedge.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@Import(GlobalExceptionHandler.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @DisplayName("GET /api/dashboard/summary returns 200 OK with summary statistics")
    void getSummary_Returns200() throws Exception {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTotalCustomers(7);
        summary.setActiveAccounts(10);
        summary.setTotalDeposits(new BigDecimal("704462.50"));
        summary.setPendingLoans(3);
        summary.setApprovedLoans(3);
        summary.setRejectedLoans(1);
        summary.setAccountsByType(Collections.singletonMap("CHECKING", 6L));
        summary.setLoansByStatus(Collections.singletonMap("APPROVED", 3L));

        when(dashboardService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCustomers").value(7))
                .andExpect(jsonPath("$.activeAccounts").value(10))
                .andExpect(jsonPath("$.totalDeposits").value(704462.50))
                .andExpect(jsonPath("$.pendingLoans").value(3));
    }
}
