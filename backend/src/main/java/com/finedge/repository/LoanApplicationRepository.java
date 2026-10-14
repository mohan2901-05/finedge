package com.finedge.repository;

import com.finedge.entity.LoanApplication;
import com.finedge.entity.LoanStatus;
import com.finedge.entity.LoanType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);

    boolean existsByApplicationNumber(String applicationNumber);

    long countByCustomerId(Long customerId);

    long countByStatus(LoanStatus status);

    @Query("SELECT l FROM LoanApplication l WHERE " +
           "(:customerId IS NULL OR l.customer.id = :customerId) AND " +
           "(:loanType IS NULL OR l.loanType = :loanType) AND " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(l.applicationNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.purpose) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.customer.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.customer.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<LoanApplication> findLoansFiltered(
            @Param("customerId") Long customerId,
            @Param("loanType") LoanType loanType,
            @Param("status") LoanStatus status,
            @Param("search") String search,
            Pageable pageable);
}
