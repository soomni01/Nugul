package com.example.backend.service.payment;

import com.example.backend.dto.payment.PaymentMethod;
import com.example.backend.mapper.payment.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    final PaymentMapper mapper;

//    // 결제 내역 유효성 검사 (금액이 0보다 큰지)
//    public boolean validate(PaymentRecord paymentrecord) {
//        return paymentrecord.getPaymentAmount() > 0;
//    }
//
//    // 결제 내역 저장
//    public boolean savePayment(PaymentRecord paymentrecord) {
//        int cnt = mapper.savePayment(paymentrecord);
//        return cnt == 1;
//    }

    // 결제 내역 조회
    public List<PaymentMethod> getPayment(String buyerId) {
        return mapper.getPayment(buyerId);
    }

    // 사용자가 거래 완료할 수 있는 권한이 있는지 확인
    public boolean hasPayAccess(Integer roomId, Authentication auth) {
        String buyerId = mapper.getBuyerId(roomId);
        String writerId = mapper.getWriter(roomId);

        // 로그인한 사용자가 구매자이거나 (왜냐면 구매자가 결제를 했을 때 거래 완료로 바뀌어야해서) 판매자일 경우 권한을 부여
        // (구매자 ID가 로그인한 사용자와 일치하거나, 판매자 ID가 로그인한 사용자와 일치하는 경우)
        return (buyerId != null && buyerId.equals(auth.getName())) || (writerId != null && writerId.equals(auth.getName()));
    }

    // 거래 완료
    public boolean transaction(PaymentMethod paymentMethod, Authentication auth) {
        int roomId = paymentMethod.getRoomId();
        Map<String, Object> transactionInfo = mapper.getTransactionInfoByRoomId(roomId); // Map을 사용하는 이유는 다양한 데이터 타입을 저장하기 위해서

        String pay = paymentMethod.getPaymentMethod();

        Integer productId = (Integer) transactionInfo.get("productId");
        String buyerId = (String) transactionInfo.get("buyerId");
        String writer = (String) transactionInfo.get("writer");
        String productName = (String) transactionInfo.get("productName");
        String locationName = (String) transactionInfo.get("locationName");
        Integer price = (Integer) transactionInfo.get("price");

        // 거래 완료 시 상태 변경
        int updateStatus = mapper.updateProductStatus(productId);

        // 구매 테이블에 거래 정보 추가
        int insertTransaction = mapper.insertTransaction(productId, buyerId, writer, productName, locationName, price, pay);

        // 성공 여부 반환
        return updateStatus == 1 && insertTransaction == 1;
    }
}