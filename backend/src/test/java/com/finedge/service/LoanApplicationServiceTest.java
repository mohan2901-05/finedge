package com.finedge.service;

import com.finedge.dto.LoanApplicationCreateRequest;
import com.finedge.dto.LoanApplicationDTO;
import com.finedge.entity.LoanApplication;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.LoanApplicationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationRepository applicationRepository;

    @InjectMocks
    private LoanApplicationService applicationService;

    private LoanApplicationCreateRequest createRequest() {
        LoanApplicationCreateRequest request = new LoanApplicationCreateRequest();
        request.setRef("TEST-REF-1");
        request.setCustomerName("Test Borrower");
        request.setCustomerPhone("9000000001");
        request.setCustomerEmail("a@example.invalid");
        request.setCustomerCity("Test City");
        request.setCustomerAddress("1 Test Road");
        request.setFinancierKey("test_fin");
        request.setFinancierLabel("Test Finance");
        request.setLoanAmount(new BigDecimal("50000.00"));
        request.setTenureMonths(12);
        request.setInterestRate(new BigDecimal("12.00"));
        request.setEmi(new BigDecimal("1000.00"));
        request.setTotalInterest(new BigDecimal("500.00"));
        request.setTotalPayable(new BigDecimal("50500.00"));
        return request;
    }

    @Test
    @DisplayName("Create persists the intake with default status")
    void create_Persists() {
        when(applicationRepository.existsByRef("TEST-REF-1")).thenReturn(false);
        when(applicationRepository.save(any(LoanApplication.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoanApplicationDTO created = applicationService.create(createRequest());

        assertEquals("TEST-REF-1", created.getRef());
        assertEquals("Pending Review", created.getStatus());
    }

    @Test
    @DisplayName("Create with a duplicate ref fails")
    void create_DuplicateRefFails() {
        when(applicationRepository.existsByRef("TEST-REF-1")).thenReturn(true);

        assertThrows(DuplicateResourceException.class,
                () -> applicationService.create(createRequest()));
    }

    @Test
    @DisplayName("Get with an unknown ID fails with 404 semantics")
    void getById_UnknownFails() {
        when(applicationRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.getById(999));
    }
}
