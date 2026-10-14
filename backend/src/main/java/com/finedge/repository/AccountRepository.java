package com.finedge.repository;

import com.finedge.entity.Account;
import com.finedge.entity.AccountStatus;
import com.finedge.entity.AccountType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    long countByCustomerId(Long customerId);

    long countByStatus(AccountStatus status);

    @Query("SELECT COALESCE(SUM(a.balance), 0) FROM Account a WHERE a.status = :status")
    BigDecimal sumBalanceByStatus(@Param("status") AccountStatus status);

    @Query("SELECT a FROM Account a WHERE " +
           "(:customerId IS NULL OR a.customer.id = :customerId) AND " +
           "(:accountType IS NULL OR a.accountType = :accountType) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(a.accountNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.customer.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.customer.lastName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Account> findAccountsFiltered(
            @Param("customerId") Long customerId,
            @Param("accountType") AccountType accountType,
            @Param("status") AccountStatus status,
            @Param("search") String search,
            Pageable pageable);
}
