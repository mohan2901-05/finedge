package com.finedge.repository;

import com.finedge.entity.LoanApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@code loan_applications}. The only {@code Integer} ID
 * in the schema (auto-increment); every other repository uses
 * {@code String}.
 */
@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Integer> {

    Optional<LoanApplication> findByRef(String ref);

    boolean existsByRef(String ref);

    List<LoanApplication> findByStatus(String status);

    List<LoanApplication> findByCustomerEmail(String customerEmail);

    Page<LoanApplication> findByStatus(String status, Pageable pageable);
}
