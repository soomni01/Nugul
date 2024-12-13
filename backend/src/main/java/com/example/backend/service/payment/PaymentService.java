package com.example.backend.service.payment;

import com.example.backend.dto.payment.PaymentRecord;
import com.example.backend.mapper.payment.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    final PaymentMapper mapper;

    // 결제 내역 유효성 검사 (금액이 0보다 큰지)
    public boolean validate(PaymentRecord paymentrecord) {
        return paymentrecord.getPaymentAmount() > 0;
    }

    // 결제 내역 저장
    public boolean savePayment(PaymentRecord paymentrecord) {
        int cnt = mapper.savePayment(paymentrecord);
        return cnt == 1;
    }

    // 결제 내역 조회
    public List<PaymentRecord> getPayment(String buyerId) {
        return mapper.getPayment(buyerId);
    }
}