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
                SELECT
                    c.*,
                    p.status AS productStatus,
                    CASE
                        WHEN c.writer = #{memberId} THEN (SELECT nickname FROM member WHERE member_id = c.buyer)
                        WHEN c.buyer = #{memberId} THEN (SELECT nickname FROM member WHERE member_id = c.writer)
                    END AS memberNickname
                FROM
                    chatroom c
                LEFT JOIN
                    product p ON c.product_id = p.product_id
                WHERE
                    c.roomId = #{roomId}
            """)
    @Results({
            @Result(column = "productStatus", property = "status"),
            @Result(column = "memberNickname", property = "nickname")
    })
    ChatRoom chatRoomViewById(String roomId, String memberId);

    @Select("""
                <script>
                    select 
                        c.*, 
                        p.status as product_status,
                        CASE 
                            WHEN c.writer = #{memberId} THEN 
                                (SELECT nickname FROM member WHERE member_id = c.buyer)
                            WHEN c.buyer = #{memberId} THEN 
                                (SELECT nickname FROM member WHERE member_id = c.writer)
                        END AS counterpartNickname
                    from chatroom c 
                    left join product p on p.product_id = c.product_id
                    <choose>                   
                        <when test="type == 'buy'">
                            where buyer = #{memberId} and c.isbuyer_deleted = 0
                        </when>
                        <when test="type == 'sell'">
                            where c.writer = #{memberId} and c.iswriter_deleted = 0
                        </when>
                        <otherwise>
                            where (c.writer = #{memberId} or buyer = #{memberId}) 
                            and ((c.writer = #{memberId} and c.iswriter_deleted = 0) 
                                 or (c.buyer = #{memberId} and c.isbuyer_deleted = 0))
                        </otherwise>
                    </choose>
                    order by roomId desc
                </script>
            """)
    @Results({
            @Result(column = "product_status", property = "status"),
            @Result(column = "counterpartNickname", property = "nickname")
    })
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


    String findNickname(String memberId);

    @Select("""
            SELECT profile_image
            FROM member
            WHERE member_id = #{id}
            """)
    String getProfileImage(String memberId);


    @Select("""
                       select  count(*) from chat_message
                                    where roomId=#{roomId} and sender=#{memberId}
            """)
    int countMessageByRoomIdAndMemberId(String roomId, String memberId);


    @Update("""
                        update  chat_message SET  sender=null
            where  sender=#{memberId}
            """)
    int updateSenderIdNull(String memberId);

    @Update("""
                UPDATE chatroom
                SET
                    buyer = CASE WHEN buyer = #{memberId} THEN NULL ELSE buyer END,
                    isbuyer_deleted = CASE WHEN buyer = #{memberId} THEN TRUE ELSE isbuyer_deleted END,
                    writer = CASE WHEN writer = #{memberId} THEN NULL ELSE writer END,
                    iswriter_deleted = CASE WHEN writer = #{memberId} THEN TRUE ELSE iswriter_deleted END
                WHERE buyer = #{memberId} OR writer = #{memberId}
            """)
    int updateBuyerIdOrWriterIdNull(String memberId);

    @Select("""
                    SELECT  *
                    FROM  chatroom
                    where  writer = #{memberId} or buyer = #{memberId}
            """)
    List<ChatRoom> selectAllChatRoom(String memberId);
}
