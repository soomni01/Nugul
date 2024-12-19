package com.example.backend.dto.payment;

import lombok.Data;

@Data
public class PaymentMethod {
    private String impUid;
    private Integer roomId;
    private String paymentMethod;
}