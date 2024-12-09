package com.example.backend.mapper.mypage;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.product.Product;
import com.example.backend.dto.review.Review;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MyPageMapper {

    @Select("""
            SELECT p.product_id, p.product_name, p.price, p.category, p.pay, p.status, p.created_at, p.location_name, pf.name AS main_image_name
            FROM product_like l
            LEFT JOIN product p ON l.product_id = p.product_id
            LEFT JOIN product_file pf ON p.product_id = pf.product_id AND pf.is_main = TRUE
            WHERE l.member_id = #{name} 
            """)
    List<Product> getLikes(String name);

    @Select("""
            SELECT
                p.product_id,
                p.category,
                p.product_name,
                p.location_name,
                p.pay,
                p.price,
                p.status,
                p.created_at, 
                pr.date AS purchasedAt, 
                m.nickname AS buyer_nickname
            FROM 
                product p
            LEFT JOIN 
                purchased_record pr ON p.product_id = pr.product_id
            LEFT JOIN 
                member m ON m.member_id = pr.buyer_id 
            WHERE 
                writer = #{name}
            """)
    List<Product> getSoldProducts(String name);


//    @Select("""
//            SELECT pr.buyer_id, pr.product_id,  p.product_name, p.price, p.category, p.location_name, m.nickname, p.created_at, p.status, p.pay
//            FROM purchased_record pr
//            LEFT JOIN product p ON pr.product_id = p.product_id
//            LEFT JOIN member m ON pr.buyer_id = m.member_id
//            WHERE seller_id = #{name}
//            AND pr.product_id IS NOt NULL
//            """)
//    List<Product> getSoldProducts(String name);

    @Select("""
            SELECT DISTINCT p.product_id, pr.expense_id, pr.date, pr.product_name, p.writer, pr.price, p.category, p.pay, p.status,
                p.created_at, pr.location_name, pr.date AS purchased_at, m.nickname, pr.review_status
            FROM purchased_record pr
            LEFT JOIN product p ON pr.product_id = p.product_id
            LEFT JOIN member m ON pr.seller_id = m.member_id
            LEFT JOIN review r ON pr.product_id = r.product_id 
            WHERE pr.buyer_id = #{name}
            """)
    List<Product> getPurchasedProducts(String name);

    @Delete("""
            DELETE FROM purchased_record
            WHERE product_id = #{product_id}
            """)
    int deletePurchased(Integer product_id);

    @Select("""
            SELECT COUNT(*)
            FROM member 
            WHERE member_id = #{sellerId}""")
    boolean checkSellerExists(String sellerId);

    @Update("""
            UPDATE purchased_record
            SET review_status = 'completed'
            WHERE expense_id=#{expenseId}
            """)
    int updatePurchasedReviewStatus(Integer expenseId);

    @Insert("""
            INSERT INTO review
            (product_id, product_name, buyer_id, buyer_name, review_text, rating, seller_id, price, review_status)
            VALUES (#{productId}, #{productName}, #{buyerId}, #{buyerName}, #{reviewText}, #{rating}, #{sellerId}, #{price}, #{reviewStatus})
            """)
    @Options(keyProperty = "reviewId", useGeneratedKeys = true)
    int insertReview(Review review);

    @Select("""
            <script>
            SELECT r.review_id, r.product_id, r.product_name, r.buyer_id, r.buyer_name, r.price, r.seller_id, r.review_text, r.rating, r.created_at, m.nickname as seller_name
             FROM review r
             LEFT JOIN member m ON r.seller_id = m.member_id
                <where>
                    <if test="role == 'buyer'">
                        AND buyer_id = #{memberId}
                    </if>
                    <if test="role == 'seller'">
                        AND seller_id = #{memberId}
                    </if>
                        AND review_status = 'completed'
                </where>
            </script>
            """)
    List<Review> getReviews(String memberId, String role);

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
            SELECT AVG(rating) AS average_rating
            FROM review
            WHERE seller_id = #{id};
            """)
    Double getRating(String id);
}