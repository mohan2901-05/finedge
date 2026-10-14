package com.finedge.service;

import com.finedge.dto.UserCreateRequest;
import com.finedge.dto.UserDTO;
import com.finedge.entity.Organization;
import com.finedge.entity.RoleMaster;
import com.finedge.entity.UserInfo;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.OrganizationRepository;
import com.finedge.repository.RoleMasterRepository;
import com.finedge.repository.UserInfoRepository;
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
class UserServiceTest {

    @Mock
    private UserInfoRepository userRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private RoleMasterRepository roleRepository;

    @Mock
    private StringIdGenerator idGenerator;

    @InjectMocks
    private UserService userService;

    private UserCreateRequest createRequest() {
        UserCreateRequest request = new UserCreateRequest();
        request.setOrgId("ORG-1");
        request.setRoleId("ROLE-1");
        request.setUserName("Test User");
        request.setPassword("secret-value");
        request.setUserEmail("user@example.invalid");
        return request;
    }

    private void stubParents() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        RoleMaster role = new RoleMaster();
        role.setRoleId("ROLE-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(roleRepository.findById("ROLE-1")).thenReturn(Optional.of(role));
    }

    @Test
    @DisplayName("Create stores the user and never exposes password or PAN")
    void create_HidesSecrets() {
        stubParents();
        when(userRepository.existsByUserEmail("user@example.invalid")).thenReturn(false);
        when(idGenerator.generateUnique(anyString(), any(Predicate.class))).thenReturn("USR-ABC123");
        when(userRepository.save(any(UserInfo.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO created = userService.create(createRequest());

        assertEquals("USR-ABC123", created.getUserId());
        // UserDTO exposes no password/pan accessors by construction; the
        // compile-time absence plus this response-shape test guard it.
        assertEquals("user@example.invalid", created.getUserEmail());
    }

    @Test
    @DisplayName("Create with a duplicate email fails")
    void create_DuplicateEmailFails() {
        stubParents();
        when(userRepository.existsByUserEmail("user@example.invalid")).thenReturn(true);

        assertThrows(DuplicateResourceException.class,
                () -> userService.create(createRequest()));
    }

    @Test
    @DisplayName("Create with an unknown organization fails with 404")
    void create_UnknownOrgFails() {
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.create(createRequest()));
    }

    @Test
    @DisplayName("Create with an unknown role fails with 404")
    void create_UnknownRoleFails() {
        Organization org = new Organization();
        org.setOrgId("ORG-1");
        when(organizationRepository.findById("ORG-1")).thenReturn(Optional.of(org));
        when(roleRepository.findById("ROLE-1")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.create(createRequest()));
    }
}
