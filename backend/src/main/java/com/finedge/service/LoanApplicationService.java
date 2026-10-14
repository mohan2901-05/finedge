package com.finedge.service;

import com.finedge.dto.LoanApplicationDTO;
import com.finedge.dto.LoanCreateRequest;
import com.finedge.dto.LoanUpdateRequest;
import com.finedge.dto.PageResponse;
import com.finedge.entity.Customer;
import com.finedge.entity.LoanApplication;
import com.finedge.entity.LoanStatus;
import com.finedge.entity.LoanType;
import com.finedge.exception.BusinessRuleException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.LoanApplicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final CustomerRepository customerRepository;

    public LoanApplicationService(LoanApplicationRepository loanApplicationRepository,
                                  CustomerRepository customerRepository) {
        this.loanApplicationRepository = loanApplicationRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<LoanApplicationDTO> getLoans(Long customerId, LoanType loanType, LoanStatus status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "applicationDate"));
        Page<LoanApplication> loanPage = loanApplicationRepository.findLoansFiltered(customerId, loanType, status, search, pageable);
        List<LoanApplicationDTO> dtos = loanPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return PageResponse.from(loanPage, dtos);
    }

    @Transactional(readOnly = true)
    public LoanApplicationDTO getLoanById(Long id) {
        LoanApplication loan = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));
        return mapToDTO(loan);
    }

    public LoanApplicationDTO createLoan(LoanCreateRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        LoanApplication loan = new LoanApplication();
        String currentYear = String.valueOf(LocalDate.now().getYear());
        String randomSuffix = UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 4);
        loan.setApplicationNumber("LN-" + currentYear + "-" + randomSuffix);
        loan.setCustomer(customer);
        loan.setLoanType(request.getLoanType());
        loan.setRequestedAmount(request.getRequestedAmount());
        loan.setInterestRate(request.getInterestRate());
        loan.setTenureMonths(request.getTenureMonths());
        loan.setPurpose(request.getPurpose().trim());
        loan.setStatus(LoanStatus.PENDING);
        loan.setApplicationDate(LocalDate.now());

        LoanApplication saved = loanApplicationRepository.save(loan);
        return mapToDTO(saved);
    }

    public LoanApplicationDTO updateLoan(Long id, LoanUpdateRequest request) {
        LoanApplication loan = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));

        loan.setStatus(request.getStatus());
        if (request.getReviewedBy() != null && !request.getReviewedBy().isBlank()) {
            loan.setReviewedBy(request.getReviewedBy().trim());
        }
        if (request.getStatus() == LoanStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw new BusinessRuleException("A rejection reason is required when marking a loan application as REJECTED.");
            }
            loan.setRejectionReason(request.getRejectionReason().trim());
        } else {
            loan.setRejectionReason(null);
        }

        LoanApplication updated = loanApplicationRepository.save(loan);
        return mapToDTO(updated);
    }

    public void deleteLoan(Long id) {
        LoanApplication loan = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));

        // Note: For demonstration purposes, allowing deletion of application
        loanApplicationRepository.delete(loan);
    }

    public LoanApplicationDTO mapToDTO(LoanApplication loan) {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setId(loan.getId());
        dto.setApplicationNumber(loan.getApplicationNumber());
        if (loan.getCustomer() != null) {
            dto.setCustomerId(loan.getCustomer().getId());
            dto.setCustomerName(loan.getCustomer().getFullName());
            dto.setCustomerEmail(loan.getCustomer().getEmail());
        }
        dto.setLoanType(loan.getLoanType());
        dto.setRequestedAmount(loan.getRequestedAmount());
        dto.setInterestRate(loan.getInterestRate());
        dto.setTenureMonths(loan.getTenureMonths());
        dto.setPurpose(loan.getPurpose());
        dto.setStatus(loan.getStatus());
        dto.setApplicationDate(loan.getApplicationDate());
        dto.setReviewedBy(loan.getReviewedBy());
        dto.setRejectionReason(loan.getRejectionReason());
        dto.setCreatedAt(loan.getCreatedAt());
        dto.setUpdatedAt(loan.getUpdatedAt());
        return dto;
    }
}
