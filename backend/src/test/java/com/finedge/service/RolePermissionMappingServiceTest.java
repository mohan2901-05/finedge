package com.finedge.service;

import com.finedge.dto.RolePermissionMappingCreateRequest;
import com.finedge.dto.RolePermissionMappingDTO;
import com.finedge.entity.ModuleMaster;
import com.finedge.entity.Organization;
import com.finedge.entity.PermissionMaster;
import com.finedge.entity.RoleMaster;
import com.finedge.entity.RolePermissionMapping;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.ModuleMasterRepository;
import com.finedge.repository.OrganizationRepository;
import com.finedge.repository.PermissionMasterRepository;
import com.finedge.repository.RoleMasterRepository;
import com.finedge.repository.RolePermissionMappingRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RolePermissionMappingServiceTest {

    @Mock
    private RolePermissionMappingRepository mappingRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private RoleMasterRepository roleRepository;

    @Mock
    private ModuleMasterRepository moduleRepository;

    @Mock
    private PermissionMasterRepository permissionRepository;

    @Mock
    private StringIdGenerator idGenerator;

    @InjectMocks
    private RolePermissionMappingService mappingService;

    private RolePermissionMappingCreateRequest createRequest() {
        RolePermissionMappingCreateRequest request = new RolePermissionMappingCreateRequest();
        request.setOrgId("ORG-1");
        request.setRoleId("ROLE-1");
        request.setModuleId("MOD-1");
        request.setPermissionId("PERM-1");
        return request;
    }

    private void stubParents() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        RoleMaster role = new RoleMaster();
        role.setRoleId("ROLE-1");
        ModuleMaster module = new ModuleMaster();
        module.setModuleId("MOD-1");
        PermissionMaster permission = new PermissionMaster();
        permission.setPermissionId("PERM-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(roleRepository.findById("ROLE-1")).thenReturn(Optional.of(role));
        when(moduleRepository.findById("MOD-1")).thenReturn(Optional.of(module));
        when(permissionRepository.findById("PERM-1")).thenReturn(Optional.of(permission));
    }

    @Test
    @DisplayName("Create assigns a generated ID")
    void create_AssignsId() {
        stubParents();
        when(mappingRepository.existsByOrganization_OrgIdAndRole_RoleIdAndModule_ModuleIdAndPermission_PermissionId(
                "ORG-1", "ROLE-1", "MOD-1", "PERM-1")).thenReturn(false);
        when(idGenerator.generateUnique(anyString(), any(Predicate.class))).thenReturn("MAP-ABC123");
        when(mappingRepository.save(any(RolePermissionMapping.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RolePermissionMappingDTO created = mappingService.create(createRequest());

        assertEquals("MAP-ABC123", created.getMappingId());
    }

    @Test
    @DisplayName("Create of a duplicate assignment fails")
    void create_DuplicateFails() {
        stubParents();
        when(mappingRepository.existsByOrganization_OrgIdAndRole_RoleIdAndModule_ModuleIdAndPermission_PermissionId(
                "ORG-1", "ROLE-1", "MOD-1", "PERM-1")).thenReturn(true);

        assertThrows(DuplicateResourceException.class,
                () -> mappingService.create(createRequest()));
    }

    @Test
    @DisplayName("Create with an unknown parent fails with 404")
    void create_UnknownParentFails() {
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> mappingService.create(createRequest()));
    }
}
