package com.example.backend.mapper.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
            WHERE inquiry_id = #{inquiry_id}
            """)
    Inquiry findById(int inquiryId);
}
