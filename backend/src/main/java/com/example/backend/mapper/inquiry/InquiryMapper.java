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
                   i.content,
                   i.category,
                   i.inserted,
                   EXISTS (
                       SELECT 1
                       FROM inquiry_comment ic
                       WHERE ic.inquiry_id = i.inquiry_id
                   ) AS has_answer
            FROM inquiry i
            WHERE i.member_id = #{memberId}
            """)
    Inquiry viewByMemberId(int memberId);

    @Select("""
            SELECT i.inquiry_id,
                   i.title,
                   i.category,
                   i.member_id,
                   i.inserted,
                   EXISTS (
                       SELECT 1
                       FROM inquiry_comment ic
                       WHERE ic.inquiry_id = i.inquiry_id
                   ) AS has_answer
            FROM inquiry i
            ORDER BY i.inserted DESC
            """)
    List<Inquiry> InquiryAll();

    @Select("""
            SELECT i.inquiry_id,
                   i.title,
                   i.content,
                   i.category,
                   i.member_id,
                   i.inserted
            FROM inquiry i
            WHERE i.inquiry_id = #{inquiryId}
            """)
    Inquiry findById(int inquiryId);

    @Insert("""
            INSERT INTO inquiry_comment
            (inquiry_id, admin_id, comment)
            VALUES (#{inquiryId}, #{memberId}, #{comment})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertcomment(InquiryComment inquirycomment);

    @Select("""
            SELECT 
                ic.id, 
                ic.inquiry_id, 
                ic.admin_id AS member_id, 
                m.nickname, 
                ic.comment, 
                ic.inserted 
            FROM inquiry_comment ic
            JOIN member m ON ic.admin_id = m.member_id
            WHERE ic.inquiry_id = #{inquiryId}
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

    @Insert("""
            INSERT INTO inquiry
            (title, content, category, member_id)
            VALUES (#{title}, #{content}, #{category}, #{memberId})
            """)
    @Options(keyProperty = "inquiryId", useGeneratedKeys = true)
    int insert(Inquiry inquiry);

    @Select("""
            SELECT i.inquiry_id,
                   i.title,
                   i.content,
                   i.category,
                   i.member_id,
                   i.inserted,
                   EXISTS (
                       SELECT 1
                       FROM inquiry_comment ic
                       WHERE ic.inquiry_id = i.inquiry_id
                   ) AS has_answer
            FROM inquiry i
            WHERE i.member_id = #{memberId}
            ORDER BY i.inquiry_id DESC
            """)
    List<Inquiry> inquiryList(String memberId);

    @Select("""
            SELECT i.inquiry_id,
                   i.title,
                   i.content,
                   i.category,
                   i.member_id,
                   i.inserted
            FROM inquiry i
            WHERE i.inquiry_id = #{inquiryId}
            """)
    Inquiry inquiryListview(String memberId, int inquiryId);

    @Update("""
            UPDATE inquiry
            SET category = #{category},
                title = #{title},
                content = #{content}
            WHERE inquiry_id = #{inquiryId}
            """)
    int inquiryEdit(Inquiry inquiry);

    @Delete("""
            DELETE FROM inquiry
            WHERE inquiry_id = #{inquiryId}
            """)
    int deleteInquiry(int inquiryId);

    @Select("""
            SELECT inquiry_id, title, content, member_id, answer, inserted
            FROM inquiry
            WHERE inquiry_id = #{inquiryId}
            """)
    Inquiry selectByInquiryId(int inquiryId);
}
