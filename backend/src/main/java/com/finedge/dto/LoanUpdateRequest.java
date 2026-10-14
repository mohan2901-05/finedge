package com.finedge.dto;

import com.finedge.entity.LoanStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LoanUpdateRequest {

    @NotNull(message = "Loan status is required")
    private LoanStatus status;

    @Size(max = 100, message = "Reviewed by cannot exceed 100 characters")
    private String reviewedBy;

    @Size(max = 255, message = "Rejection reason cannot exceed 255 characters")
    private String rejectionReason;

    public LoanUpdateRequest() {
    }

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
