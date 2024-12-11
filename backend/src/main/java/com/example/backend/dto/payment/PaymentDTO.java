package com.example.backend.dto.payment;

import lombok.Data;

@Data
public class PaymentDTO {
    private Integer paymentId;
    private String impUid;
    private String buyerId;
    private Integer productId;
    private String productName;
    private Double paymentAmount;
    private String paymentMethod;
    private String paymentDate;
    private String status;
}
