package com.finedge.service;

import com.finedge.dto.LoanInfoCreateRequest;
import com.finedge.dto.LoanInfoDTO;
import com.finedge.entity.LoanInfo;
import com.finedge.entity.Organization;
import com.finedge.entity.UserInfo;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.LoanInfoRepository;
import com.finedge.repository.OrganizationRepository;
import com.finedge.repository.UserInfoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.function.Predicate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoanInfoServiceTest {

    @Mock
    private LoanInfoRepository loanRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private UserInfoRepository userRepository;

    @Mock
    private StringIdGenerator idGenerator;

    @InjectMocks
    private LoanInfoService loanService;

    private LoanInfoCreateRequest createRequest() {
        LoanInfoCreateRequest request = new LoanInfoCreateRequest();
        request.setOrgId("ORG-1");
        request.setUserId("USR-1");
        request.setLoanAmount(new BigDecimal("120000.00"));
        request.setTenureMonths(12);
        return request;
    }

    private void stubParents() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        UserInfo user = new UserInfo();
        user.setUserId("USR-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(userRepository.findById("USR-1")).thenReturn(Optional.of(user));
    }

    @Test
    @DisplayName("Create assigns a generated ID with PENDING default")
    void create_AssignsId() {
        stubParents();
        when(idGenerator.generateUnique(anyString(), any(Predicate.class))).thenReturn("LOAN-ABC123");
        when(loanRepository.save(any(LoanInfo.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoanInfoDTO created = loanService.create(createRequest());

        assertEquals("LOAN-ABC123", created.getLoanId());
        assertEquals("PENDING", created.getStatus());
    }

    @Test
    @DisplayName("Received flag maps between Boolean DTO and numeric storage")
    void create_ReceivedMapping() {
        stubParents();
        when(idGenerator.generateUnique(anyString(), any(Predicate.class))).thenReturn("LOAN-ABC123");
        when(loanRepository.save(any(LoanInfo.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoanInfoCreateRequest request = createRequest();
        request.setReceived(true);

        assertTrue(loanService.create(request).getReceived());
    }

    @Test
    @DisplayName("Create with an unknown organization fails with 404")
    void create_UnknownOrgFails() {
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> loanService.create(createRequest()));
    }

    @Test
    @DisplayName("Create with an unknown user fails with 404")
    void create_UnknownUserFails() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(userRepository.findById("USR-1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> loanService.create(createRequest()));
    }
}
