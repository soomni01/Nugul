package com.example.backend.member.mapper;

import com.example.backend.member.dto.Member;
import com.example.backend.member.dto.MemberEdit;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {
    @Insert("""
            INSERT INTO member
            (member_id,password,name,nickname)
            VALUES (#{memberId}, #{password}, #{name},#{nickName})
            """)
    int insert(Member member);

    @Select("""
            SELECT * FROM member
            WHERE member_id=#{id}
            """)
    Member selectById(String id);

    @Select("""
            SELECT * FROM member
            WHERE nickname=#{nickName}
            """)
    Member selectByNickName(String nickName);

    @Select("""
            SELECT member_id, name, nickname, inserted 
            FROM member
            ORDER BY member_id
            """)
    List<Member> selectAll();


    @Delete("""
            DELETE FROM member
            WHERE member_id=#{memberId}
            """)
    int deleteById(String memberId);

    @Update("""
            UPDATE member
            SET password = #{password} ,
            nickname=#{nickName}
            WHERE member_id=#{memberId}
            """)
    int update(MemberEdit member);
}
