package com.example.backend.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChatMapper {


    @Insert("""
                   INSERT INTO chatroom (productName,writer)
            VALUES (#{productName}, #{writer})
            """)
    int createChatRoom(String productName, String writer);
}
