package com.finedge.controller;

import com.finedge.dto.LoanApplicationDTO;
import com.finedge.dto.LoanCreateRequest;
import com.finedge.dto.LoanUpdateRequest;
import com.finedge.dto.PageResponse;
import com.finedge.entity.LoanStatus;
import com.finedge.entity.LoanType;
import com.finedge.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    public LoanApplicationController(LoanApplicationService loanApplicationService) {
        this.loanApplicationService = loanApplicationService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<LoanApplicationDTO>> getLoans(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) LoanType loanType,
            @RequestParam(required = false) LoanStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(loanApplicationService.getLoans(customerId, loanType, status, search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplicationDTO> getLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(loanApplicationService.getLoanById(id));
    }

    @PostMapping
    public ResponseEntity<LoanApplicationDTO> createLoan(@Valid @RequestBody LoanCreateRequest request) {
        LoanApplicationDTO created = loanApplicationService.createLoan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoanApplicationDTO> updateLoan(
            @PathVariable Long id,
            @Valid @RequestBody LoanUpdateRequest request) {
        return ResponseEntity.ok(loanApplicationService.updateLoan(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        loanApplicationService.deleteLoan(id);
        return ResponseEntity.noContent().build();
    }
}
