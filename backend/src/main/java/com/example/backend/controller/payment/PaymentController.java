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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

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
    public String savePayment(@RequestBody PaymentRecord paymentrecord) {
        try {
            System.out.println("결제 요청 데이터: " + paymentrecord);
            service.savePayment(paymentrecord);  // 결제 내역 저장
            System.out.println("결제 내역 저장 완료");
            return "결제 내역이 성공적으로 저장되었습니다.";
        } catch (Exception e) {
            e.printStackTrace();
            return "결제 내역 저장 중 오류가 발생했습니다.";
        }
    }
}
