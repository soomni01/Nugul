package com.example.backend.service.chat;

import com.example.backend.dto.chat.ChatMessage;
import com.example.backend.dto.chat.ChatRoom;
import com.example.backend.mapper.chat.ChatMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper mapper;


    public boolean creatChatRoom(ChatRoom chatRoom) {
        int cnt = mapper.createChatRoom(chatRoom);

        return cnt == 1;
    }

    public ChatRoom chatRoomView(String roomId) {
        return mapper.chatRoomViewById(roomId);
    }


    public List<ChatRoom> chatRoomList(String memberId, String type) {
        //db 수정해야함
        return mapper.chatRoomListByMemberId(memberId, type);
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

    // 0인데 , 그럼 select 을 먼저 해보고 해야하나
//         아 근데 문제가 , 댓글을 나만 작성하고 나만 하는건데,  >chat은 서로나누는거잖아 ,근데 상대가 입력한 정보까지 삭제하면,
    // 안되는거 아닌가 ?
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
}
