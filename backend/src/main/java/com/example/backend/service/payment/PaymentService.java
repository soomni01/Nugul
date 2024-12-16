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

    // 사용자가 거래를 완료할 수 있는 권한이 있는지 확인
    public boolean hasPayAccess(Integer roomId, Authentication auth) {
        // 구매자 ID를 가져오는 로직
        String buyerId = mapper.getBuyerId(roomId);
        // 판매자 ID를 가져오는 로직
        String writerId = mapper.getWriter(roomId);

        // 로그인한 사용자가 구매자이거나 (왜냐면 구매자가 결제를 했을 때 거래 완료로 바뀌어야해서) 판매자일 경우 권한을 부여
        // (구매자 ID가 로그인한 사용자와 일치하거나, 판매자 ID가 로그인한 사용자와 일치하는 경우)
        return (buyerId != null && buyerId.equals(auth.getName())) || (writerId != null && writerId.equals(auth.getName()));
    }

    // 거래 완료
    public boolean transaction(int productId, Authentication auth) {
        Product product = mapper.selectById(productId);
        // 현재 인증된 사용자 아이디 가져오기
        String buyer_id = auth.getName();
        // 거래 완료 시에 Sold로 상태 변경
        int updateStatus = mapper.updateProductStatus(productId);
        // 구매 테이블에 거래 정보 추가
        int insertTrasaction = mapper.insertTranscation(productId, buyer_id, product.getWriter(), product.getProductName(), product.getLocationName(), product.getPrice());
        return updateStatus == 1 && insertTrasaction == 1;
    }
}