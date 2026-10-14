package com.finedge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finedge.dto.CustomerCreateRequest;
import com.finedge.dto.CustomerDTO;
import com.finedge.dto.PageResponse;
import com.finedge.entity.CustomerStatus;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.GlobalExceptionHandler;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.service.CustomerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
@Import(GlobalExceptionHandler.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    @Test
    @DisplayName("GET /api/customers returns 200 OK and paginated response")
    void getCustomers_Returns200() throws Exception {
        PageResponse<CustomerDTO> pageResponse = new PageResponse<>(
                Collections.emptyList(), 0, 10, 0, 0, true, true);
        when(customerService.getCustomers(any(), eq(0), eq(10))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/customers?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pageNumber").value(0))
                .andExpect(jsonPath("$.pageSize").value(10));
    }

    @Test
    @DisplayName("GET /api/customers/{id} returns 200 OK when customer exists")
    void getCustomerById_Returns200() throws Exception {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(1L);
        dto.setCustomerNumber("CUST-1001");
        dto.setFirstName("Eleanor");
        dto.setLastName("Vance");
        dto.setEmail("eleanor.vance@example.com");

        when(customerService.getCustomerById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("eleanor.vance@example.com"));
    }

    @Test
    @DisplayName("GET /api/customers/{id} returns 404 NOT FOUND when customer does not exist")
    void getCustomerById_NotFound_Returns404() throws Exception {
        when(customerService.getCustomerById(999L))
                .thenThrow(new ResourceNotFoundException("Customer not found with id: 999"));

        mockMvc.perform(get("/api/customers/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Customer not found with id: 999"));
    }

    @Test
    @DisplayName("POST /api/customers returns 201 CREATED for valid request")
    void createCustomer_Valid_Returns201() throws Exception {
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

        CustomerDTO created = new CustomerDTO();
        created.setId(1L);
        created.setFirstName("Eleanor");
        created.setEmail("eleanor.vance@example.com");

        when(customerService.createCustomer(any())).thenReturn(created);

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Eleanor"));
    }

    @Test
    @DisplayName("POST /api/customers returns 400 BAD REQUEST when request body fails validation")
    void createCustomer_InvalidEmail_Returns400() throws Exception {
        CustomerCreateRequest request = new CustomerCreateRequest();
        request.setFirstName("E"); // too short (< 2)
        request.setEmail("invalid-email-format");

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    @DisplayName("POST /api/customers returns 409 CONFLICT on duplicate email")
    void createCustomer_DuplicateEmail_Returns409() throws Exception {
        CustomerCreateRequest request = new CustomerCreateRequest();
        request.setFirstName("Eleanor");
        request.setLastName("Vance");
        request.setEmail("eleanor.vance@example.com");
        request.setPhone("+1-555-0101");
        request.setAddress("742 Evergreen Terrace");
        request.setCity("Springfield");
        request.setState("IL");
        request.setPostalCode("62704");

        when(customerService.createCustomer(any()))
                .thenThrow(new DuplicateResourceException("A customer with email 'eleanor.vance@example.com' already exists."));

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    @Test
    @DisplayName("DELETE /api/customers/{id} returns 204 NO CONTENT on success")
    void deleteCustomer_Returns204() throws Exception {
        mockMvc.perform(delete("/api/customers/1"))
                .andExpect(status().isNoContent());
    }
}
