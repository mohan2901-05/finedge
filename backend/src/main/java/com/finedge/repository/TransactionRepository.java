package com.finedge.repository;

import com.finedge.entity.Transaction;
import com.finedge.entity.TransactionStatus;
import com.finedge.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionReference(String transactionReference);

    boolean existsByTransactionReference(String transactionReference);

    long countByAccountId(Long accountId);

    List<Transaction> findTop10ByOrderByTransactionDateDesc();

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:accountId IS NULL OR t.account.id = :accountId) AND " +
           "(:type IS NULL OR t.transactionType = :type) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(t.transactionReference) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.account.accountNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Transaction> findTransactionsFiltered(
            @Param("accountId") Long accountId,
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("search") String search,
            Pageable pageable);
}
