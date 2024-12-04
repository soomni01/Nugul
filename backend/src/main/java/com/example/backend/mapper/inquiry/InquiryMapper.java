package com.example.backend.mapper.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InquiryMapper {

    @Select("""
            SELECT i.inquiry_id,
                   i.title,
                   i.member_id,
                   i.inserted,
                   EXISTS (
                       SELECT 1
                       FROM inquiry_comment ic
                       WHERE ic.inquiry_id = i.inquiry_id
                   ) AS has_answer
            FROM inquiry i
            ORDER BY i.inquiry_id
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
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertcomment(InquiryComment inquirycomment);

    @Select("""
            SELECT id, inquiry_id, admin_id member_id, comment, inserted
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

    @Delete("""
            DELETE FROM inquiry_comment
            WHERE id = #{commentId}
            """)
    int deleteComment(int commentId);
}
