package com.finedge.service;

import com.finedge.dto.CustomerCreateRequest;
import com.finedge.dto.CustomerDTO;
import com.finedge.dto.CustomerUpdateRequest;
import com.finedge.dto.PageResponse;
import com.finedge.entity.Customer;
import com.finedge.exception.BusinessRuleException;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.LoanApplicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final LoanApplicationRepository loanApplicationRepository;

    public CustomerService(CustomerRepository customerRepository,
                           AccountRepository accountRepository,
                           LoanApplicationRepository loanApplicationRepository) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.loanApplicationRepository = loanApplicationRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<CustomerDTO> getCustomers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Customer> customerPage = customerRepository.searchCustomers(search, pageable);
        List<CustomerDTO> dtos = customerPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return PageResponse.from(customerPage, dtos);
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapToDTO(customer);
    }

    public CustomerDTO createCustomer(CustomerCreateRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A customer with email '" + request.getEmail() + "' already exists.");
        }

        Customer customer = new Customer();
        customer.setCustomerNumber("CUST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        customer.setFirstName(request.getFirstName().trim());
        customer.setLastName(request.getLastName().trim());
        customer.setEmail(request.getEmail().trim().toLowerCase());
        customer.setPhone(request.getPhone().trim());
        customer.setAddress(request.getAddress().trim());
        customer.setCity(request.getCity().trim());
        customer.setState(request.getState().trim());
        customer.setPostalCode(request.getPostalCode().trim());
        customer.setStatus(request.getStatus());

        Customer saved = customerRepository.save(customer);
        return mapToDTO(saved);
    }

    public CustomerDTO updateCustomer(Long id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!customer.getEmail().equalsIgnoreCase(newEmail) && customerRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("Email '" + newEmail + "' is already in use by another customer.");
        }

        customer.setFirstName(request.getFirstName().trim());
        customer.setLastName(request.getLastName().trim());
        customer.setEmail(newEmail);
        customer.setPhone(request.getPhone().trim());
        customer.setAddress(request.getAddress().trim());
        customer.setCity(request.getCity().trim());
        customer.setState(request.getState().trim());
        customer.setPostalCode(request.getPostalCode().trim());
        customer.setStatus(request.getStatus());

        Customer updated = customerRepository.save(customer);
        return mapToDTO(updated);
    }

    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        // Strict Financial Deletion Policy: prevent deleting customer with open accounts or loans
        long accountsCount = accountRepository.countByCustomerId(id);
        if (accountsCount > 0) {
            throw new BusinessRuleException("Cannot delete customer '" + customer.getFullName() +
                    "' because they possess " + accountsCount + " existing financial account(s). Close or remove accounts first.");
        }

        long loansCount = loanApplicationRepository.countByCustomerId(id);
        if (loansCount > 0) {
            throw new BusinessRuleException("Cannot delete customer '" + customer.getFullName() +
                    "' because they possess " + loansCount + " loan application record(s).");
        }

        customerRepository.delete(customer);
    }

    public CustomerDTO mapToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setCustomerNumber(customer.getCustomerNumber());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setFullName(customer.getFullName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setState(customer.getState());
        dto.setPostalCode(customer.getPostalCode());
        dto.setStatus(customer.getStatus());
        dto.setAccountCount((int) accountRepository.countByCustomerId(customer.getId()));
        dto.setCreatedAt(customer.getCreatedAt());
        dto.setUpdatedAt(customer.getUpdatedAt());
        return dto;
    }
}
