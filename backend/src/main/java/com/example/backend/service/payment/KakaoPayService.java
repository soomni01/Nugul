package com.example.backend.service.payment;

import com.example.backend.config.KakaoPayProperties;
import com.example.backend.dto.payment.KakaoReadyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class KakaoPayService {

    private final KakaoPayProperties payProperties;
    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        // 'KakaoAK ' 대신 비밀키만 사용해 보세요.
        String auth = payProperties.getSecretKey();
        headers.set("Authorization", auth); // 'KakaoAK' 접두어 제거
        headers.set("Content-Type", "application/json");
        return headers;
    }

    public KakaoReadyResponse kakaoPayReady() {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("cid", payProperties.getCid());
        parameters.put("partner_order_id", "product_id");
        parameters.put("partner_user_id", "sender_id");
        parameters.put("item_name", "product_name");
        parameters.put("quantity", "1");
        parameters.put("total_amount", "2200");
        parameters.put("tax_free_amount", "200");
        parameters.put("approval_url", "http://localhost:5173/pay/success");
        parameters.put("cancel_url", "http://localhost:5173/pay/cancel");
        parameters.put("fail_url", "http://localhost:5173/pay/fail");

        log.info("Request parameters: {}", parameters); // 요청 파라미터 로그 출력

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());
        log.info("Request entity created with body: {}", requestEntity.getBody());

        KakaoReadyResponse kakaoReady = null;
        try {
            log.info("Sending request to KakaoPay API...");
            kakaoReady = restTemplate.postForObject(
                    "https://open-api.kakaopay.com/online/v1/payment/ready",
                    requestEntity, KakaoReadyResponse.class);
            log.info("Response received: {}", kakaoReady);
        } catch (Exception e) {
            log.error("Error occurred while making request to KakaoPay API: {}", e.getMessage(), e);
        }
        return kakaoReady;
    }
}
