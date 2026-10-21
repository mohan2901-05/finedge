package com.finedge.service;

import com.finedge.dto.LoanApplicationCreateRequest;
import com.finedge.dto.LoanApplicationDTO;
import com.finedge.dto.LoanApplicationUpdateRequest;
import com.finedge.dto.PageResponse;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
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

    @Test
    @DisplayName("Create trims string fields")
    void create_TrimsFields() {
        LoanApplicationCreateRequest request = createRequest();
        request.setRef("  TEST-REF-1  ");
        request.setCustomerName("  Test Borrower  ");
        when(applicationRepository.existsByRef("  TEST-REF-1  ")).thenReturn(false);
        when(applicationRepository.save(any(LoanApplication.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoanApplicationDTO created = applicationService.create(request);

        assertEquals("TEST-REF-1", created.getRef());
        assertEquals("Test Borrower", created.getCustomerName());
    }

    @Test
    @DisplayName("Create propagates repository exceptions")
    void create_RepositoryThrows() {
        when(applicationRepository.existsByRef("TEST-REF-1")).thenReturn(false);
        when(applicationRepository.save(any(LoanApplication.class)))
                .thenThrow(new RuntimeException("db down"));

        assertThrows(RuntimeException.class,
                () -> applicationService.create(createRequest()));
    }

    @Test
    @DisplayName("Get by ID returns the DTO")
    void getById_ReturnsDto() {
        LoanApplication application = new LoanApplication();
        application.setId(7);
        application.setRef("TEST-REF-1");
        application.setStatus("Pending Review");
        when(applicationRepository.findById(7)).thenReturn(Optional.of(application));

        LoanApplicationDTO dto = applicationService.getById(7);

        assertEquals(7, dto.getId());
        assertEquals("TEST-REF-1", dto.getRef());
    }

    @Test
    @DisplayName("Get by ref returns the DTO")
    void getByRef_ReturnsDto() {
        LoanApplication application = new LoanApplication();
        application.setId(7);
        application.setRef("TEST-REF-1");
        when(applicationRepository.findByRef("TEST-REF-1")).thenReturn(Optional.of(application));

        LoanApplicationDTO dto = applicationService.getByRef("TEST-REF-1");

        assertEquals("TEST-REF-1", dto.getRef());
        assertEquals(7, dto.getId());
    }

    @Test
    @DisplayName("Get by unknown ref fails with 404")
    void getByRef_UnknownFails() {
        when(applicationRepository.findByRef("NOPE")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.getByRef("NOPE"));
    }

    @Test
    @DisplayName("List without a filter queries all applications")
    void list_AllReturnsPage() {
        LoanApplication application = new LoanApplication();
        application.setId(7);
        application.setRef("TEST-REF-1");
        when(applicationRepository.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(application)));

        PageResponse<LoanApplicationDTO> page = applicationService.list(null, 0, 10);

        assertEquals(1, page.getContent().size());
        assertEquals("TEST-REF-1", page.getContent().get(0).getRef());
        verify(applicationRepository).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("List with a status filter queries by status")
    void list_ByStatus() {
        LoanApplication application = new LoanApplication();
        application.setId(7);
        application.setRef("TEST-REF-1");
        when(applicationRepository.findByStatus(anyString(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(application)));

        PageResponse<LoanApplicationDTO> page = applicationService.list("Pending Review", 0, 10);

        assertEquals(1, page.getContent().size());
        verify(applicationRepository).findByStatus(anyString(), any(Pageable.class));
    }

    @Test
    @DisplayName("List with no rows returns an empty page")
    void list_EmptyReturnsEmpty() {
        when(applicationRepository.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        PageResponse<LoanApplicationDTO> page = applicationService.list(null, 0, 10);

        assertTrue(page.getContent().isEmpty());
    }

    @Test
    @DisplayName("Update patches supplied fields")
    void update_Success() {
        LoanApplication application = new LoanApplication();
        application.setId(7);
        application.setRef("TEST-REF-1");
        application.setCustomerName("Old");
        application.setStatus("Pending Review");
        LoanApplicationUpdateRequest request = new LoanApplicationUpdateRequest();
        request.setCustomerName(" New Name ");
        request.setStatus("Approved");
        when(applicationRepository.findById(7)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(LoanApplication.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoanApplicationDTO updated = applicationService.update(7, request);

        assertEquals("New Name", updated.getCustomerName());
        assertEquals("Approved", updated.getStatus());
        assertEquals("TEST-REF-1", updated.getRef());
    }

    @Test
    @DisplayName("Update with an unknown ID fails with 404")
    void update_UnknownFails() {
        LoanApplicationUpdateRequest request = new LoanApplicationUpdateRequest();
        request.setCustomerName("New");
        when(applicationRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.update(999, request));
    }

    @Test
    @DisplayName("Delete removes the application")
    void delete_Removes() {
        LoanApplication application = new LoanApplication();
        application.setId(7);
        when(applicationRepository.findById(7)).thenReturn(Optional.of(application));

        applicationService.delete(7);

        verify(applicationRepository).delete(application);
    }

    @Test
    @DisplayName("Delete with an unknown ID fails with 404")
    void delete_UnknownFails() {
        when(applicationRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> applicationService.delete(999));
    }
}
