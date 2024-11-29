package com.example.backend.mapper;

import com.example.backend.dto.ChatRoom;
import org.apache.ibatis.annotations.*;

import java.util.List;

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
    ChatRoom chatRoomViewById(String roomId);


    @Select("""
                select *
                from chatroom
                order by roomId desc
            """)
    List<ChatRoom> allChatRoomList();

    @Delete("""
                        delete from chatroom
            where roomId =#{roomId}
            """)
    int deleteChatRoomByRoomId(String roomId);
}
