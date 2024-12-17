package com.example.backend.dto.payment;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PaymentRecord {
    private String impUid;
    private String buyerId;
    private Integer productId;
    private String productName;
    private Double paymentAmount;
    private String paymentMethod;
    private LocalDate paymentDate;
    private String status;
}