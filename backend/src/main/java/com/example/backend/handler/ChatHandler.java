package com.example.backend.handler;


import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.List;

@Component   // spring에서 beand 을 의미 , 의존성 주입을 통해 다른 컴포넌트와 상호작용
@Log4j2      // 선언한 클래스에서 log라는 이름으로 logger 객체 자동 생성
public class ChatHandler extends TextWebSocketHandler {
    private static List<WebSocketSession> list = new ArrayList<WebSocketSession>();

    // 클라이언트로 부터 메시지를 받았을 때 처리하는 로직
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload:" + payload);
        // 페이로드란 전송되는 데이터를 의미
        for (WebSocketSession sess : list) {
            sess.sendMessage(message);
        }
    }

    // 클라이언트가 열결되었을때 
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        list.add(session);
        log.info(session + "클라이언트 접속");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(session + "클라이언트 접속 해제");
        list.remove(session);
    }

}
