package com.example.backend.mapper.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface InquiryMapper {

    @Select("""
            SELECT inquiry_id, title, member_id, inserted
            FROM inquiry
            ORDER BY inquiry_id
            """)
    List<Inquiry> InquiryAll();

    @Select("""
            SELECT *
            FROM inquiry
            WHERE inquiry_id = #{inquiryId}
            """)
    Inquiry findById(int inquiryId);

    @Insert("""
            INSERT INTO inquiry_comment
            (inquiry_id, admin_id,comment)
            VALUES (#{inquiryId}, #{memberId}, #{comment})
            """)
    int insertcomment(InquiryComment inquirycomment);

    @Select("""
            SELECT *
            FROM inquiry_comment
            WHERE inquiry_id = #{inquiryId}
            """)
    List<InquiryComment> findCommentsByInquiryId(int inquiryId);

    @Update("""
            UPDATE inquiry_comment
            SET comment = #{comment}
            WHERE id = #{id}
            """)
    int update(InquiryComment inquirycomment);
}
