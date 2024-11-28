package com.example.backend.mapper;

import com.example.backend.dto.ChatRoom;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface ChatMapper {


    @Insert("""
                   INSERT INTO chatroom (productName,writer)
            VALUES (#{productName}, #{writer})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "roomId")
    int createChatRoom(ChatRoom chatInfo);
}
