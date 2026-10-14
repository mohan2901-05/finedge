package com.finedge.service;

import com.finedge.dto.OrganizationCreateRequest;
import com.finedge.dto.OrganizationDTO;
import com.finedge.entity.Organization;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.OrganizationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.function.Predicate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganizationServiceTest {

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private StringIdGenerator idGenerator;

    @InjectMocks
    private OrganizationService organizationService;

    private OrganizationCreateRequest createRequest() {
        OrganizationCreateRequest request = new OrganizationCreateRequest();
        request.setOrgName("Test Org");
        request.setOrgEmail("test@example.invalid");
        return request;
    }

    @Test
    @DisplayName("Create assigns a generated ID and returns the DTO")
    void create_AssignsId() {
        when(organizationRepository.existsByOrgEmail("test@example.invalid")).thenReturn(false);
        when(idGenerator.generateUnique(anyString(), any(Predicate.class))).thenReturn("ORG-ABC123");
        when(organizationRepository.save(any(Organization.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OrganizationDTO created = organizationService.create(createRequest());

        assertEquals("ORG-ABC123", created.getOrgId());
        assertEquals("Test Org", created.getOrgName());
        verify(organizationRepository).save(any(Organization.class));
    }

    @Test
    @DisplayName("Create with a duplicate email fails with 409 semantics")
    void create_DuplicateEmailFails() {
        when(organizationRepository.existsByOrgEmail("test@example.invalid")).thenReturn(true);

        assertThrows(DuplicateResourceException.class,
                () -> organizationService.create(createRequest()));
    }

    @Test
    @DisplayName("Get with an unknown ID fails with 404 semantics")
    void getById_UnknownFails() {
        when(organizationRepository.findById("NOPE")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> organizationService.getById("NOPE"));
    }

    @Test
    @DisplayName("Delete removes the organization")
    void delete_Removes() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));

        organizationService.delete("ORG-1");

        verify(organizationRepository).delete(org);
    }
}
