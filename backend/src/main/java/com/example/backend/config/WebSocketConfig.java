package com.example.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    // stomp 클라이언트 생성 관련 코드
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // stomp 접속 주소 url = ws://localhost:8080/ws-chat, 프로토콜이 http가 아니다!
        registry.addEndpoint("/wschat") // 연결될 엔드포인트 ?
                .setAllowedOriginPatterns("http://localhost:5173")
                .withSockJS();  // 버전 낮은 브라우저에서도 적용 가능
        // 경로 로그 출력
        System.out.println("STOMP WebSocket 엔드포인트: /ws-chat");

        // 개발자에게 엔드포인트 정보 출력
        logger.info("WebSocket 연결 엔드포인트: /ws-chat");
        logger.info("WebSocket 서버가 ws://localhost:8080/ws-chat에서 대기 중");


    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에서 보낸 메시지를 받을 prefix
        //메시지를 받아서 처리할 경로 , > localhost:8080/app << 에서 이를 처리하는 로직 실행
        registry.setApplicationDestinationPrefixes("/app");
        // 해당 주소를 구독하고 있은 클라이언트 들에게 메시지 전달
        // 채팅방 번호로 바꾸면 되고
        registry.enableSimpleBroker("/topic");


    }
}
