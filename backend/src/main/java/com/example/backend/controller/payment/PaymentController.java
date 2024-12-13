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

@RestController
@RequiredArgsConstructor
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
    @PostMapping("/api/verifyIamport/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable("imp_uid") String imp_uid) throws IamportResponseException, IOException {
        return iamportClient.paymentByImpUid(imp_uid);
    }

    // 결제 내역 저장
    @PostMapping("/api/savePayment")
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
    @GetMapping("/api/getPayment")
    @PreAuthorize("isAuthenticated()")
    public List<PaymentRecord> getPayment(Authentication auth) {
        String buyerId = auth.getName();
        return service.getPayment(buyerId);
    }
}