package com.example.backend.mapper.mypage;

import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MyPageMapper {

    @Select("""
            SELECT p.product_id, p.product_name, p.price, p.category, p.pay, p.status, p.created_at, p.location_name
            FROM product_like l LEFT JOIN product p ON l.product_id = p.product_id
            WHERE l.member_id = #{name} 
            """)
    List<Product> getLikes(String name);

    @Select("""
            SELECT *
            FROM product
            WHERE writer = #{name}
            """)
    List<Product> getSoldProducts(String name);

    @Select("""
            SELECT pr.date, p.product_id,  p.product_name, p.writer, p.price, p.category, p.pay, p.status,
                p.created_at, p.location_name, pr.date AS purchased_at, m.nickname, r.review_status
            FROM purchased_record pr
            LEFT JOIN product p ON pr.product_id = p.product_id
            LEFT JOIN member m ON p.writer = m.member_id
            LEFT JOIN review r ON r.product_id = pr.product_id
            WHERE pr.buyer_id = #{name}
            """)
    List<Product> getPurchasedProducts(String name);

    @Select("""
            SELECT product_id
            FROM purchased_record
            WHERE buyer_id = #{name}
            """)
    List<Integer> purchasedProductByMemberId(String name);

    @Delete("""
            DELETE FROM purchased_record
            WHERE product_id = #{product_id}
            """)
    int deletePurchased(Integer product_id);

    @Insert("""
            INSERT INTO review
            (product_id, product_name, buyer_id, buyer_name, review_text, rating, seller_id, price, review_status)
            VALUES (#{productId}, #{productName}, #{buyerId}, #{buyerName}, #{reviewText}, #{rating}, #{sellerId}, #{price}, #{reviewStatus})
            """)
    @Options(keyProperty = "reviewId", useGeneratedKeys = true)
    int insertReview(Review review);
}
