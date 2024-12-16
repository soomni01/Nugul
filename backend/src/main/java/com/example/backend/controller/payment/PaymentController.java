package com.example.backend.controller.payment;

import com.example.backend.dto.payment.PaymentRecord;
import com.example.backend.service.payment.PaymentService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PaymentController {

    @Value("${iamport.key}")
    private String restApiKey;

    @Value("${iamport.secret}")
    private String restApiSecret;

    private IamportClient iamportClient;
    private final PaymentService service;

    @PostConstruct
    public void init() {
        this.iamportClient = new IamportClient(restApiKey, restApiSecret);
    }

    // 결제 확인 API
    @PostMapping("/verifyIamport/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable("imp_uid") String imp_uid) throws IamportResponseException, IOException {
        return iamportClient.paymentByImpUid(imp_uid);
    }

    // 결제 내역 저장
    @PostMapping("/savePayment")
    public ResponseEntity<PaymentRecord> savePayment(@RequestBody PaymentRecord paymentrecord) {
        if (service.validate(paymentrecord)) {
            if (service.savePayment(paymentrecord)) {
                return ResponseEntity.ok(paymentrecord); // 결제 내역만 반환
            } else {
                return ResponseEntity.internalServerError().build(); // 실패 시 메시지 없이 500 상태 반환
            }
        } else {
            return ResponseEntity.badRequest().build(); // 유효하지 않은 데이터일 경우 400 상태 반환
        }
    }

    // 결제 내역 조회
    @GetMapping("/getPayment")
    @PreAuthorize("isAuthenticated()")
    public List<PaymentRecord> getPayment(Authentication auth) {
        String buyerId = auth.getName();
        return service.getPayment(buyerId);
    }

    // 특정 사용자 결제 내역 조회 (관리자용)
    @GetMapping("/getPaymentByMember")
    @PreAuthorize("isAuthenticated()")
    public List<PaymentRecord> getPaymentByMember(@RequestParam String memberId) {
        return service.getPayment(memberId);
    }

    // 거래 완료
    @PostMapping("/product/transaction/{productId}")
    public ResponseEntity<Map<String, Object>> transaction(@PathVariable int productId, @RequestBody Map<String, Integer> requestBody, Authentication auth) {
        Integer roomId = requestBody.get("roomId"); // 요청 body에서 roomId 추출
        if (service.hasPayAccess(roomId, auth)) {
            if (service.transaction(roomId, auth)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success", "text", STR."\{productId}번 상품 거래가 완료되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error", "text", "상품 거래 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error", "text", "거래를 완료할 권한이 없습니다.")));
        }
    }
}