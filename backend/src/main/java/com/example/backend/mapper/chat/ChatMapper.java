package com.example.backend.mapper.chat;

import com.example.backend.dto.chat.ChatMessage;
import com.example.backend.dto.chat.ChatRoom;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ChatMapper {


    @Insert("""
              INSERT INTO chatroom (productName, writer, nickname,buyer, product_id)
              VALUES (
                  #{productName},
                  #{writer},
                  (SELECT  distinct (nickname) FROM member WHERE member_id = #{writer}),
                    #{buyer},
                    #{productId}
              )
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
                <script>
                    select *
                    from chatroom
                    <choose>                   
                        <when test="type == 'buy'">
                            where buyer = #{memberId}
                        </when>
                        <when test="type == 'sell'">
                            where writer = #{memberId}
                        </when>
                        <otherwise>
                              where writer = #{memberId} or buyer = #{memberId}
                        </otherwise>
                    </choose>
                    order by roomId desc
                </script>
            """)
    List<ChatRoom> chatRoomListByMemberId(String memberId, String type);

    @Delete("""
                        delete from chatroom
            where roomId =#{roomId}
            """)
    int deleteChatRoomByRoomId(String roomId);

    // 닉네임만 가져옴
    @Select("""
                  select   distinct (m.nickname)
                                  from chatroom c join member m
                                  where m.member_id=#{writer}
            """)
    String findNickNameByWriter(String writer);

    @Insert("""
                        Insert into chat_message
                        (sender,roomId,content)
            values (#{sender},#{roomId},#{content})
            """)
    int insertMessage(ChatMessage chatMessage);

    @Select("""
                    select *
                    from chat_message
                    where roomId=#{roomId}
            
            """)
    List<ChatMessage> chatMessageByRoomId(String roomId);

    @Select("""
                    select roomId
                    from chatroom
                    where product_id=#{productId} and writer=#{writer} and buyer=#{buyer}
            """)
    Integer findChatRoomId(ChatRoom chatRoom);

    @Select("""
                        select *
                        from chat_message
                        where roomId=#{roomId}
                        order by id desc
                        limit #{offset},8
            """)
    List<ChatMessage> chatMessagePageByRoomId(String roomId, Integer offset);

    @Delete("""
                    delete from chat_message
                    where roomId=#{roomId} and sender=#{memberId}
            """)
    int deleteChatRoomMessageByRoomId(String roomId, String memberId);

    @Select("""
                        select  count(*) from chat_message
                        where roomId=#{roomId}
            """)
    int countMessageByRoomId(String roomId);

    @Update("""
                UPDATE chatroom
                SET 
                    iswriter_deleted = CASE 
                        WHEN writer = #{memberId} THEN #{messageRemoved}
                        ELSE iswriter_deleted
                    END,
                    isbuyer_deleted = CASE
                        WHEN buyer = #{memberId} THEN #{messageRemoved}
                        ELSE isbuyer_deleted
                    END
                WHERE roomId = #{roomId}
                AND (writer = #{memberId} OR buyer = #{memberId})
            """)
    int updateDeleted(boolean messageRemoved, String memberId, String roomId);

    @Select("""
                SELECT 
                    CASE
                        WHEN iswriter_deleted = TRUE AND isbuyer_deleted = TRUE THEN TRUE
                        ELSE FALSE
                    END AS both_true
                FROM chatroom
                WHERE roomId = #{roomId}
            """)
    boolean checkAllDeleted(String roomId);

    @Select("""
                SELECT 
                    CASE
                        WHEN iswriter_deleted = FALSE AND isbuyer_deleted = FALSE THEN TRUE
                        ELSE FALSE
                    END AS both_true
                FROM chatroom
                WHERE roomId = #{roomId}
            """)
    boolean checkNoOneDeleted(String roomId);
}
