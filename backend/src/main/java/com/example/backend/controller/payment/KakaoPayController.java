package com.example.backend.controller.payment;

import com.example.backend.dto.payment.KakaoReadyResponse;
import com.example.backend.service.payment.KakaoPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/payment")
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;

    @PostMapping("/ready")
    public KakaoReadyResponse readyToKakaoPay() {
        return kakaoPayService.kakaoPayReady();
    }
}
