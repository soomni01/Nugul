package com.example.backend.service.chat;

import com.example.backend.dto.chat.ChatMessage;
import com.example.backend.dto.chat.ChatRoom;
import com.example.backend.mapper.chat.ChatMapper;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper mapper;
    private final ProductMapper productMapper;


    public boolean creatChatRoom(ChatRoom chatRoom) {
        int cnt = mapper.createChatRoom(chatRoom);

        return cnt == 1;
    }

    public ChatRoom chatRoomView(String roomId) {


        ChatRoom chatRoom = mapper.chatRoomViewById(roomId);
        System.out.println("chatRoom = " + chatRoom);
        return chatRoom;
    }


    public List<ChatRoom> chatRoomList(String memberId, String type) {
        //db 수정해야함??
        // 상태 가져오기
        List<ChatRoom> chatRoomList = mapper.chatRoomListByMemberId(memberId, type);

        chatRoomList.forEach(chatRoom -> {
//            String nickName = mapper.findNickname(memberId);
        });
        return chatRoomList;
    }

    public boolean deleteChatRoom(String roomId) {

        int cnt = mapper.deleteChatRoomByRoomId(roomId);
        return cnt == 1;
    }

    public String findNickname(String writer) {

        return mapper.findNickNameByWriter(writer);
    }

    public void insertMessage(ChatMessage chatMessage) {

        mapper.insertMessage(chatMessage);
    }


    public Integer findChatRoomId(ChatRoom chatRoom) {

        return mapper.findChatRoomId(chatRoom);
    }

    public List<ChatMessage> chatMessageView(String roomId) {

        return mapper.chatMessageByRoomId(roomId);
    }


    // 메시지 로딩
    public List<ChatMessage> getMessageById(String roomId, Integer page) {
        Integer offset = (page - 1) * 8;
        return mapper.chatMessagePageByRoomId(roomId, offset);
    }


    public boolean deleteMessageAll(String roomId, String memberId) {

        // 삭제전 메시지  갯수 확인 >  없으면 default 뭐시기 오류 뜸
        int messageCount = mapper.countMessageByRoomId(roomId);

        //메시지 갯수가 0 보다 크면 > 메세지를 지우고 삭제하고 , 그 여부에 따라 > 실패를 반납,  0이면 > 그냥 삭제하면 됨
        if (messageCount > 0) {
            int cnt = mapper.deleteChatRoomMessageByRoomId(roomId, memberId);
            return cnt == 1;
        } else {
            return true;
        }
    }

    public boolean updateDeleted(boolean messageRemoved, String memberId, String roomId) {
        int cnt = mapper.updateDeleted(messageRemoved, memberId, roomId);
        return cnt == 1;
    }

    public boolean checkAllDeleted(String roomId) {

        return mapper.checkAllDeleted(roomId);
    }

    public boolean noOneDeleted(String roomId) {
        boolean noOneDeleted = mapper.checkNoOneDeleted(roomId);
        int cnt = mapper.countMessageByRoomId(roomId);


        //메시지 갯수도 0이고 ,삭제도 안했음 > 즉 메시지를 작성한적이없음
        return cnt == 0 && noOneDeleted;

    }
}
