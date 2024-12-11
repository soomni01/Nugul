package com.example.backend.controller.payment;

import com.example.backend.dto.payment.PaymentDTO;
import com.example.backend.service.payment.PaymentService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class PaymentController {

    @Value("${iamport.key}")
    private String restApiKey;

    @Value("${iamport.secret}")
    private String restApiSecret;

    private IamportClient iamportClient;
    private PaymentService service;

    @PostConstruct
    public void init() {
        this.iamportClient = new IamportClient(restApiKey, restApiSecret);
    }

    // 결제 확인 API
    @PostMapping("/verifyIamport/{imp_uid}")
    public IamportResponse<PaymentDTO> paymentByImpUid(@PathVariable("imp_uid") String imp_uid) throws IamportResponseException, IOException {
        System.out.println("Received imp_uid: " + imp_uid);  // 로그 추가
        return iamportClient.paymentByImpUid(imp_uid);
    }


    // 결제 내역 저장 API
    @PostMapping("/savePayment")
    public String savePayment(@RequestBody PaymentDTO payment) {
        try {
            service.savePayment(payment);  // 결제 내역 저장
            return "결제 내역이 성공적으로 저장되었습니다.";
        } catch (Exception e) {
            return "결제 내역 저장 중 오류가 발생했습니다.";
        }
    }
}
