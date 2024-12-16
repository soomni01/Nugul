package com.example.backend.service.payment;

import com.example.backend.dto.payment.PaymentRecord;
import com.example.backend.dto.product.Product;
import com.example.backend.mapper.payment.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
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

    public boolean hasPayAccess(Integer roomId, Authentication auth) {
        String buyerId = mapper.getBuyerId(roomId);
        return buyerId != null && buyerId.equals(auth.getName());
    }

    public boolean transaction(int productId, Authentication auth) {
        Product product = mapper.selectById(productId);
        // 현재 인증된 사용자 아이디 가져오기
        String buyer_id = auth.getName();
        // 거래 완료 시에 Sold로 상태 변경
        int updateStatus = mapper.updateProductStatus(productId);
        // 구매 테이블에 추가 (buyer 임의로 설정)
        int insertTrasaction = mapper.insertTranscation(productId, buyer_id, product.getWriter(), product.getProductName(), product.getLocationName(), product.getPrice());
        return updateStatus == 1 && insertTrasaction == 1;
    }
}