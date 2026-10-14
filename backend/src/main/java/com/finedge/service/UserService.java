package com.finedge.service;

import com.finedge.dto.PageResponse;
import com.finedge.dto.UserCreateRequest;
import com.finedge.dto.UserDTO;
import com.finedge.dto.UserUpdateRequest;
import com.finedge.entity.Organization;
import com.finedge.entity.RoleMaster;
import com.finedge.entity.UserInfo;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.OrganizationRepository;
import com.finedge.repository.RoleMasterRepository;
import com.finedge.repository.UserInfoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User records. The stored {@code password} is write-only input kept exactly
 * as received and is never returned, logged, or queried by this service.
 * No hashing, strength enforcement, login, or RBAC enforcement lives here —
 * those require confirmed authentication requirements (see report).
 */
@Service
@Transactional
public class UserService {

    private final UserInfoRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final RoleMasterRepository roleRepository;
    private final StringIdGenerator idGenerator;

    public UserService(UserInfoRepository userRepository,
                       OrganizationRepository organizationRepository,
                       RoleMasterRepository roleRepository,
                       StringIdGenerator idGenerator) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
        this.idGenerator = idGenerator;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserDTO> list(String orgId, String roleId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedDatetime"));
        Page<UserInfo> result;
        if (orgId != null && !orgId.isBlank()) {
            result = userRepository.findByOrganization_OrgId(orgId, pageable);
        } else if (roleId != null && !roleId.isBlank()) {
            result = userRepository.findByRole_RoleId(roleId, pageable);
        } else {
            result = userRepository.findAll(pageable);
        }
        List<UserDTO> dtos = result.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return PageResponse.from(result, dtos);
    }

    @Transactional(readOnly = true)
    public UserDTO getById(String id) {
        return mapToDTO(requireById(id));
    }

    public UserDTO create(UserCreateRequest request) {
        Organization org = organizationRepository.findById(request.getOrgId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Organization not found with id: " + request.getOrgId()));
        RoleMaster role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Role not found with id: " + request.getRoleId()));
        if (userRepository.existsByUserEmail(request.getUserEmail())) {
            throw new DuplicateResourceException(
                    "A user with email '" + request.getUserEmail() + "' already exists.");
        }
        UserInfo user = new UserInfo();
        user.setUserId(idGenerator.generateUnique("USR", userRepository::existsById));
        user.setOrganization(org);
        user.setRole(role);
        user.setUserName(request.getUserName().trim());
        user.setPassword(request.getPassword());
        user.setUserEmail(request.getUserEmail().trim());
        user.setDob(request.getDob());
        user.setPanNo(request.getPanNo());
        user.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        return mapToDTO(userRepository.save(user));
    }

    public UserDTO update(String id, UserUpdateRequest request) {
        UserInfo user = requireById(id);
        if (request.getUserName() != null) {
            user.setUserName(request.getUserName().trim());
        }
        if (request.getUserEmail() != null) {
            String email = request.getUserEmail().trim();
            if (!email.equalsIgnoreCase(user.getUserEmail()) && userRepository.existsByUserEmail(email)) {
                throw new DuplicateResourceException(
                        "A user with email '" + email + "' already exists.");
            }
            user.setUserEmail(email);
        }
        if (request.getDob() != null) {
            user.setDob(request.getDob());
        }
        if (request.getRoleId() != null) {
            RoleMaster role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Role not found with id: " + request.getRoleId()));
            user.setRole(role);
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        return mapToDTO(userRepository.save(user));
    }

    /**
     * Deletes the user. Loans, collections, activities, and audit rows that
     * reference this user cascade at the database level per the supplied
     * schema (collections where the user was only the collecting agent are
     * preserved with that column set to NULL).
     */
    public void delete(String id) {
        userRepository.delete(requireById(id));
    }

    public UserDTO mapToDTO(UserInfo user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        if (user.getOrganization() != null) {
            dto.setOrgId(user.getOrganization().getOrgId());
        }
        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getRoleId());
            dto.setRoleName(user.getRole().getRoleName());
        }
        dto.setUserName(user.getUserName());
        dto.setUserEmail(user.getUserEmail());
        dto.setDob(user.getDob());
        dto.setStatus(user.getStatus());
        dto.setCreatedDatetime(user.getCreatedDatetime());
        dto.setUpdatedDatetime(user.getUpdatedDatetime());
        return dto;
    }

    private UserInfo requireById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
