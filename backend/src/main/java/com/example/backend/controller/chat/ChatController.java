package com.example.backend.controller.chat;


import com.example.backend.dto.chat.ChatMessage;
import com.example.backend.dto.chat.ChatRoom;
import com.example.backend.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

//

    @MessageMapping("/{roomId}") // send/{roomId} 이렇게 넘어오는거임
    @SendTo("/room/{roomId}")
    public ChatMessage handleChatMessage(@DestinationVariable String roomId, ChatMessage chatMessage) {

        // 보낸 메시지 저장시킬 방 번호 입력
        chatMessage.setRoomId(roomId);

        chatService.insertMessage(chatMessage);


        return chatMessage;
    }

    @PostMapping("create")
    public ResponseEntity<Integer> createChatRoom(@RequestBody ChatRoom chatRoom) {

        // 방이 있는지 먼저 확인   없으면 만들기
        Integer roomId = chatService.findChatRoomId(chatRoom);

        System.out.println("chatRoom = " + chatRoom);

        if (roomId == null) {
            chatService.creatChatRoom(chatRoom);

            return ResponseEntity.ok().body(chatRoom.getRoomId());
        } else {
            chatRoom.setRoomId(roomId);
            return ResponseEntity.ok().body(chatRoom.getRoomId());
        }


    }

    @GetMapping("view/{roomId}")
    public ChatRoom chatRoomView(@PathVariable String roomId,
                                 @RequestParam String memberId,
                                 @RequestParam(value = "page", defaultValue = "1") String page
    ) {

        //  chatroom 정보 조회
        ChatRoom chatRoom = chatService.chatRoomView(roomId, memberId);
        // 해당 채팅방의 메시지 정보 조회  , page
//        List<ChatMessage> message = chatService.chatMessageView(roomId);
//        chatRoom.setMessages(message);
        return chatRoom;

    }

    @GetMapping("view/{roomId}/messages")
    public List<ChatMessage> getMessage(@PathVariable String roomId,
                                        @RequestParam(value = "page", defaultValue = "1") Integer page) {
        // 메시지 페이지네이션
        return chatService.getMessageById(roomId, page);
        // a, 8개 까지 보여줄 거임

    }


    @GetMapping("list")
    public List<ChatRoom> chatRoomList(@RequestParam(value = "memberId") String memberId,
                                       @RequestParam(value = "type", defaultValue = "all") String type) {

        return chatService.chatRoomList(memberId, type);

    }


    //    Todo>  확인하기 쉽게  content 작성해놓았는데  기능 테스트 해보고 바꿔야함
    @DeleteMapping("delete/{roomId}")
    public ResponseEntity<Map<String, Object>> deleteChatRoom(@PathVariable String roomId,
                                                              @RequestParam String memberId) {


        boolean noOneDeleted = chatService.noOneDeleted(roomId);
        //  메시지를 보낸적 있거나 ,  메시지 보내고  삭제를 안했던가 ,  메시지 보내고 삭제했던가,
        if (!noOneDeleted) {
            // 메시지 삭제 ,  구매자, 혹은 판매자의 삭제상태 반영
            boolean messageRemoved = chatService.deleteMessageAll(roomId, memberId);
            boolean updateDeleted = chatService.updateDeleted(messageRemoved, memberId, roomId);
            boolean chatRemoved;
            // 끝나고나면 일단 메시지를 보내긴 해야하고 , 진짜 삭제할건지는 한번 더 안에서 결정해야지

            if (messageRemoved && updateDeleted) {
                // 둘다   삭제 한적 있는지 확인  >
                boolean allDeleted = chatService.checkAllDeleted(roomId);
                // 둘다 삭제 >
                if (allDeleted) {
                    // 채팅방 삭제시 전송
                    chatRemoved = chatService.deleteChatRoom(roomId);
                    if (chatRemoved) {
                        return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "content", "입력 한기록이 있는 채팅방 삭제 완료되었습니다.")));
                    } else {
                        return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning", "content", "존재하지 않는 채팅방 입니다.")));
                    }
                } else {
                    return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "content", "메시지 삭제가  완료되었습니다.")));

                }
            } else
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "warning", "content", "뭘 삭제하려는 겁니까")));
        }
        // 메시지도 갯수 0  , 아무도 삭제 안함 > , 입력한적이 없을떄 > 그냥 바로 채팅방 삭제
        else {
            boolean chatRemoved = chatService.deleteChatRoom(roomId);
            if (chatRemoved) {
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "content", "한번도 입력하지 않은 채팅방 삭제 완료되었습니다.")));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning", "content", "존재하지 않는 채팅방 입니다.")));
            }
        }
    }

    @PutMapping("updatetime")
    public void updateChatRoomTime(@RequestBody ChatRoom chatRoom) {
    }

}
