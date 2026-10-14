package com.finedge.service;

import com.finedge.dto.LoanCollectionCreateRequest;
import com.finedge.dto.LoanCollectionDTO;
import com.finedge.entity.LoanCollection;
import com.finedge.entity.LoanInfo;
import com.finedge.entity.Organization;
import com.finedge.entity.UserInfo;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.LoanCollectionRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CollectionServiceTest {

    @Mock
    private LoanCollectionRepository collectionRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private LoanInfoRepository loanRepository;

    @Mock
    private UserInfoRepository userRepository;

    @Mock
    private StringIdGenerator idGenerator;

    @InjectMocks
    private CollectionService collectionService;

    private LoanCollectionCreateRequest createRequest() {
        LoanCollectionCreateRequest request = new LoanCollectionCreateRequest();
        request.setOrgId("ORG-1");
        request.setLoanId("LOAN-1");
        request.setUserId("USR-1");
        request.setCollectionAmount(new BigDecimal("1000.00"));
        return request;
    }

    private void stubParents() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        LoanInfo loan = new LoanInfo();
        loan.setLoanId("LOAN-1");
        UserInfo payer = new UserInfo();
        payer.setUserId("USR-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(loanRepository.findById("LOAN-1")).thenReturn(Optional.of(loan));
        when(userRepository.findById("USR-1")).thenReturn(Optional.of(payer));
    }

    @Test
    @DisplayName("Create assigns a generated ID with CASH default")
    void create_AssignsId() {
        stubParents();
        when(idGenerator.generateUnique(anyString(), any(Predicate.class))).thenReturn("COLL-ABC123");
        when(collectionRepository.save(any(LoanCollection.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LoanCollectionDTO created = collectionService.create(createRequest());

        assertEquals("COLL-ABC123", created.getCollectionId());
        assertEquals("CASH", created.getPaymentMode());
    }

    @Test
    @DisplayName("Create with an unknown loan fails with 404")
    void create_UnknownLoanFails() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(loanRepository.findById("LOAN-1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> collectionService.create(createRequest()));
    }

    @Test
    @DisplayName("Create with an unknown collecting user fails with 404")
    void create_UnknownCollectorFails() {
        stubParents();
        when(userRepository.findById("USR-9")).thenReturn(Optional.empty());

        LoanCollectionCreateRequest request = createRequest();
        request.setCollectedByUserId("USR-9");

        assertThrows(ResourceNotFoundException.class,
                () -> collectionService.create(request));
    }
}
