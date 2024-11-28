package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {
    @Select("""
            SELECT member_id, name, nickname, inserted
            FROM member
            ORDER BY member_id
            """)
    List<Member> selectAll();
}
