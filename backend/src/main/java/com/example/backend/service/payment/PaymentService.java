package com.example.backend.service.payment;

import com.example.backend.dto.payment.PaymentDTO;
import com.example.backend.mapper.payment.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    @Autowired
    private PaymentMapper mapper;

    // 결제 내역 저장
    public void savePayment(PaymentDTO payment) {
        mapper.savePayment(payment);
    }
}