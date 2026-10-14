package com.finedge.service;

import com.finedge.dto.CustomerCreateRequest;
import com.finedge.dto.CustomerDTO;
import com.finedge.entity.Customer;
import com.finedge.entity.CustomerStatus;
import com.finedge.exception.BusinessRuleException;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.LoanApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private LoanApplicationRepository loanApplicationRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer mockCustomer;

    @BeforeEach
    void setUp() {
        mockCustomer = new Customer();
        mockCustomer.setId(1L);
        mockCustomer.setCustomerNumber("CUST-1001");
        mockCustomer.setFirstName("Eleanor");
        mockCustomer.setLastName("Vance");
        mockCustomer.setEmail("eleanor.vance@example.com");
        mockCustomer.setPhone("+1-555-0101");
        mockCustomer.setAddress("742 Evergreen Terrace");
        mockCustomer.setCity("Springfield");
        mockCustomer.setState("IL");
        mockCustomer.setPostalCode("62704");
        mockCustomer.setStatus(CustomerStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should create customer successfully when email is unique")
    void createCustomer_Success() {
        CustomerCreateRequest request = new CustomerCreateRequest();
        request.setFirstName("Eleanor");
        request.setLastName("Vance");
        request.setEmail("eleanor.vance@example.com");
        request.setPhone("+1-555-0101");
        request.setAddress("742 Evergreen Terrace");
        request.setCity("Springfield");
        request.setState("IL");
        request.setPostalCode("62704");
        request.setStatus(CustomerStatus.ACTIVE);

        when(customerRepository.existsByEmail("eleanor.vance@example.com")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        CustomerDTO result = customerService.createCustomer(request);

        assertNotNull(result);
        assertEquals("Eleanor", result.getFirstName());
        assertEquals("eleanor.vance@example.com", result.getEmail());
        assertTrue(result.getCustomerNumber().startsWith("CUST-"));
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when creating customer with existing email")
    void createCustomer_DuplicateEmail_ThrowsException() {
        CustomerCreateRequest request = new CustomerCreateRequest();
        request.setEmail("eleanor.vance@example.com");

        when(customerRepository.existsByEmail("eleanor.vance@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> customerService.createCustomer(request));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when customer ID does not exist")
    void getCustomerById_NotFound_ThrowsException() {
        when(customerRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomerById(999L));
    }

    @Test
    @DisplayName("Should reject customer deletion if customer possesses active financial accounts")
    void deleteCustomer_WithAccounts_ThrowsBusinessRuleException() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(accountRepository.countByCustomerId(1L)).thenReturn(2L);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> customerService.deleteCustomer(1L));
        assertTrue(ex.getMessage().contains("Cannot delete customer"));
        verify(customerRepository, never()).delete(any());
    }
}
