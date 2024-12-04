package com.example.backend.mapper.admin;

import com.example.backend.dto.product.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AdminMemberMapper {
    @Select("""
            SELECT *
            FROM product
            WHERE writer = #{memberId}
            """)
    List<Product> getSoldProductsByMemberId(String memberId);

    @Select("""
            SELECT p.*
            FROM product p
            JOIN purchased_record pr ON p.product_id = pr.product_id
            WHERE pr.buyer_id = #{memberId}
            """)
    List<Product> getPurchasedProductsByMemberId(@Param("memberId") String memberId);
}