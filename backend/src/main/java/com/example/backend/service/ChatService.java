package com.example.backend.service;

import com.example.backend.dto.ChatRoom;
import com.example.backend.mapper.ChatMapper;
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


    public List<ChatRoom> chatRoomList() {
        //db 수정해야함
        return mapper.allChatRoomList();
    }

    public void deleteChatRoom(String roomId) {

        mapper.deleteChatRoomByRoomId(roomId);
    }
}
