package com.example.backend.service.payment;

import com.example.backend.dto.payment.PaymentMethod;
import com.example.backend.mapper.payment.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    final PaymentMapper mapper;

    // 사용자가 거래 완료할 수 있는 권한이 있는지 확인
    public boolean hasPayAccess(Integer roomId, Authentication auth) {
        String buyerId = mapper.getBuyerId(roomId);
        String writerId = mapper.getWriter(roomId);

        // 로그인한 사용자가 구매자이거나 (왜냐면 구매자가 결제를 했을 때 거래 완료로 바뀌어야해서) 판매자일 경우 권한을 부여
        return (buyerId != null && buyerId.equals(auth.getName())) || (writerId != null && writerId.equals(auth.getName()));
    }

    // 거래 완료
    public boolean transaction(PaymentMethod paymentMethod, Authentication auth) {
        int roomId = paymentMethod.getRoomId();

        // roomId를 기반으로 데이터베이스에서 트랜잭션 관련 정보를 조회 (Map은 다양한 데이터 타입을 저장)
        Map<String, Object> transactionInfo = mapper.getTransactionInfoByRoomId(roomId);

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