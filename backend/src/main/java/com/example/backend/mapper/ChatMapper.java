package com.example.backend.mapper;

import com.example.backend.dto.ChatRoom;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ChatMapper {


    @Insert("""
                   INSERT INTO chatroom (productName,writer)
            VALUES (#{productName}, #{writer})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "roomId")
    int createChatRoom(ChatRoom chatInfo);

    @Select("""
                        select * 
                        from chatroom
                        where roomId =#{roomId}
            """)
    ChatRoom charRoomViewById(String roomId);
}
