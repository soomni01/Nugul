package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {
    @Insert("""
            INSERT INTO member
            (member_id,password,nickname)
            VALUES (#{memberId}, #{password},#{nickname})
            """)
    int insert(Member member);

    @Select("""
            SELECT * FROM member
            WHERE member_id=#{id}
            """)
    Member selectById(String id);

    @Select("""
            SELECT * FROM member
            WHERE nickname=#{nickname}
            """)
    Member selectByNickName(String nickname);

    @Select("""
            SELECT member_id, nickname, password, inserted 
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
            nickname=#{nickname}
            WHERE member_id=#{memberId}
            """)
    int update(MemberEdit member);

    @Select("""
            SELECT auth
            FROM auth
            WHERE member_id = #{memberId}
            """)
    List<String> selectAuthByMemberId(String id);
}
