package com.finedge.service;

import com.finedge.dto.LoanApplicationCreateRequest;
import com.finedge.dto.LoanApplicationDTO;
import com.finedge.dto.LoanApplicationUpdateRequest;
import com.finedge.dto.PageResponse;
import com.finedge.entity.LoanApplication;
import com.finedge.exception.DuplicateResourceException;
import com.finedge.exception.ResourceNotFoundException;
import com.finedge.repository.LoanApplicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Loan intake staging records. The intake table declares no foreign keys,
 * so creation never validates borrowers against {@code user_info} — the
 * intake-to-user/loan linkage rule is unconfirmed (see report) and no
 * automatic relationship is created here. Status changes are plain field
 * updates; no approval workflow is enforced.
 */
@Service
@Transactional
public class LoanApplicationService {

    private final LoanApplicationRepository applicationRepository;

    public LoanApplicationService(LoanApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<LoanApplicationDTO> list(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<LoanApplication> result = (status == null || status.isBlank())
                ? applicationRepository.findAll(pageable)
                : applicationRepository.findByStatus(status, pageable);
        List<LoanApplicationDTO> dtos = result.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return PageResponse.from(result, dtos);
    }

    @Transactional(readOnly = true)
    public LoanApplicationDTO getById(Integer id) {
        return mapToDTO(requireById(id));
    }

    @Transactional(readOnly = true)
    public LoanApplicationDTO getByRef(String ref) {
        LoanApplication application = applicationRepository.findByRef(ref)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Loan application not found with ref: " + ref));
        return mapToDTO(application);
    }

    public LoanApplicationDTO create(LoanApplicationCreateRequest request) {
        if (applicationRepository.existsByRef(request.getRef())) {
            throw new DuplicateResourceException(
                    "A loan application with ref '" + request.getRef() + "' already exists.");
        }
        LoanApplication application = new LoanApplication();
        application.setRef(request.getRef().trim());
        application.setCustomerName(request.getCustomerName().trim());
        application.setCustomerPhone(request.getCustomerPhone().trim());
        application.setCustomerEmail(request.getCustomerEmail().trim());
        application.setCustomerDob(request.getCustomerDob());
        application.setCustomerPan(request.getCustomerPan());
        application.setCustomerCity(request.getCustomerCity().trim());
        application.setCustomerAddress(request.getCustomerAddress().trim());
        application.setFinancierKey(request.getFinancierKey().trim());
        application.setFinancierLabel(request.getFinancierLabel().trim());
        application.setLoanAmount(request.getLoanAmount());
        application.setTenureMonths(request.getTenureMonths());
        application.setInterestRate(request.getInterestRate());
        application.setEmi(request.getEmi());
        application.setTotalInterest(request.getTotalInterest());
        application.setTotalPayable(request.getTotalPayable());
        application.setStatus(request.getStatus() != null ? request.getStatus() : "Pending Review");
        return mapToDTO(applicationRepository.save(application));
    }

    public LoanApplicationDTO update(Integer id, LoanApplicationUpdateRequest request) {
        LoanApplication application = requireById(id);
        if (request.getCustomerName() != null) {
            application.setCustomerName(request.getCustomerName().trim());
        }
        if (request.getCustomerPhone() != null) {
            application.setCustomerPhone(request.getCustomerPhone().trim());
        }
        if (request.getCustomerEmail() != null) {
            application.setCustomerEmail(request.getCustomerEmail().trim());
        }
        if (request.getCustomerDob() != null) {
            application.setCustomerDob(request.getCustomerDob());
        }
        if (request.getCustomerCity() != null) {
            application.setCustomerCity(request.getCustomerCity().trim());
        }
        if (request.getCustomerAddress() != null) {
            application.setCustomerAddress(request.getCustomerAddress().trim());
        }
        if (request.getFinancierKey() != null) {
            application.setFinancierKey(request.getFinancierKey().trim());
        }
        if (request.getFinancierLabel() != null) {
            application.setFinancierLabel(request.getFinancierLabel().trim());
        }
        if (request.getLoanAmount() != null) {
            application.setLoanAmount(request.getLoanAmount());
        }
        if (request.getTenureMonths() != null) {
            application.setTenureMonths(request.getTenureMonths());
        }
        if (request.getInterestRate() != null) {
            application.setInterestRate(request.getInterestRate());
        }
        if (request.getEmi() != null) {
            application.setEmi(request.getEmi());
        }
        if (request.getTotalInterest() != null) {
            application.setTotalInterest(request.getTotalInterest());
        }
        if (request.getTotalPayable() != null) {
            application.setTotalPayable(request.getTotalPayable());
        }
        if (request.getStatus() != null) {
            application.setStatus(request.getStatus());
        }
        return mapToDTO(applicationRepository.save(application));
    }

    public void delete(Integer id) {
        applicationRepository.delete(requireById(id));
    }

    public LoanApplicationDTO mapToDTO(LoanApplication application) {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setId(application.getId());
        dto.setRef(application.getRef());
        dto.setCustomerName(application.getCustomerName());
        dto.setCustomerPhone(application.getCustomerPhone());
        dto.setCustomerEmail(application.getCustomerEmail());
        dto.setCustomerDob(application.getCustomerDob());
        dto.setCustomerCity(application.getCustomerCity());
        dto.setCustomerAddress(application.getCustomerAddress());
        dto.setFinancierKey(application.getFinancierKey());
        dto.setFinancierLabel(application.getFinancierLabel());
        dto.setLoanAmount(application.getLoanAmount());
        dto.setTenureMonths(application.getTenureMonths());
        dto.setInterestRate(application.getInterestRate());
        dto.setEmi(application.getEmi());
        dto.setTotalInterest(application.getTotalInterest());
        dto.setTotalPayable(application.getTotalPayable());
        dto.setStatus(application.getStatus());
        dto.setCreatedAt(application.getCreatedAt());
        return dto;
    }

    private LoanApplication requireById(Integer id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found with id: " + id));
    }
}
