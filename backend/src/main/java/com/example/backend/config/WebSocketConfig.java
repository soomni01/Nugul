package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker   // 웹 소켓 서버를 사용하겟다는 설정
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    // stomp 클라이언트 생성 관련 코드
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // stomp 접속 주소 url = ws://localhost:8080/ws-chat, 프로토콜이 http가 아니다!
        registry.addEndpoint("/wschat") // 연결될 엔드포인트 ?
                .setAllowedOriginPatterns("http://localhost:5173");

//                .withSockJS();  // 버전 낮은 브라우저에서도 적용 가능
// sockJS 쓸거면 , 그 http 붙여야 하는거 같음


    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에서 보낸 메시지를 받을 prefix (pub)
        //메시지를 받아서 처리할 경로 , > localhost:8080/app << 에서 이를 처리하는 로직 실행
        registry.setApplicationDestinationPrefixes("/send");

        // 해당 주소를 구독하고 있은 클라이언트 들에게 메시지 전달
        // 채팅방 번호로 바꾸면 되고
        registry.enableSimpleBroker("/room");


    }
}
