package com.example.backend.mapper.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

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

    @Select("""
            <script>
            SELECT r.product_name, r.buyer_name, r.price, r.seller_id, r.review_text, r.rating, r.created_at, m.nickname as seller_name
             FROM review r
             LEFT JOIN member m ON r.seller_id = m.member_id
                <where>
                    <if test="role == 'buyer'">
                        AND buyer_id = #{id}
                    </if>
                    <if test="role == 'seller'">
                        AND seller_id = #{id}
                    </if>
                        AND review_status = 'completed'
                </where>
            </script>
            """)
    List<Review> getReviews(String id, String role);

    @Select("""
            SELECT i.inquiry_id,
                   i.title,
                   i.content,
                   i.category,
                   i.member_id,
                   i.nickname,
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
                   i.nickname,
                   i.inserted
            FROM inquiry i
            WHERE i.inquiry_id = #{inquiryId}
            """)
    Inquiry inquiryListview(String memberId, int inquiryId);

    @Select("""
            SELECT id, inquiry_id, admin_id AS member_id, comment, inserted
            FROM inquiry_comment
            WHERE inquiry_id = #{inquiryId}
            """)
    List<InquiryComment> findCommentsByInquiryId(int inquiryId);

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

    @Select("""
            SELECT DATE_FORMAT(date, '%Y-%m') AS month,
            SUM(CASE WHEN buyer_id = #{memberId} THEN price ELSE 0 END) AS total_purchases
            FROM purchased_record
            GROUP BY DATE_FORMAT(date, '%Y-%m')
            """)
    List<Map<String, Object>> getMonthlyPurchases(String memberId);

    @Select("""
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                   SUM(CASE WHEN writer = #{memberId} THEN price ELSE 0 END) AS total_sales
            FROM product
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            """)
    List<Map<String, Object>> getMonthlySales(String memberId);
}