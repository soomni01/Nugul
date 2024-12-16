package com.example.backend.mapper.payment;

import com.example.backend.dto.payment.PaymentRecord;
import com.example.backend.dto.product.Product;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PaymentMapper {
    @Insert("""
            INSERT INTO payment_record (imp_uid, buyer_id, product_name, payment_amount, payment_method, payment_date, status)
            VALUES (#{impUid}, #{buyerId}, #{productName}, #{paymentAmount}, #{paymentMethod}, #{paymentDate}, #{status})
            """)
    int savePayment(PaymentRecord paymentrecord);

    @Select("""
            SELECT  p.product_id, p.product_name, p.price, p.writer, p.category, p.description, 
            p.created_at, p.pay, p.latitude, p.longitude, p.location_name, m.nickname, pf.name as mainImageName
            FROM product p
            LEFT JOIN member m ON p.writer = m.member_id
            LEFT JOIN product_file pf ON p.product_id = pf.product_id AND pf.is_main = TRUE
            WHERE p.product_id = #{productId}
            """)
    Product selectById(Integer productId);

    @Select("""
            SELECT *
            FROM payment_record 
            WHERE buyer_id = #{buyerId}
            """)
    List<PaymentRecord> getPayment(String buyerId);

    @Select("""
            SELECT buyer
            FROM chatroom
            WHERE roomId = #{roomId}
            """)
    String getBuyerId(Integer roomId);

    @Select("""
            SELECT writer
            FROM chatroom
            WHERE roomId = #{roomId}
            """)
    String getWriter(Integer roomId);

    @Update("""
            UPDATE product
            SET status = 'Sold'
            WHERE product_id = #{id}
            """)
    int updateProductStatus(int id);

    @Insert("""
            Insert purchased_record
            (buyer_id, product_id, seller_id, product_name, location_name, price)
            VALUES (#{buyerId}, #{productId}, #{writer}, #{productName}, #{locationName}, #{price})
            """)
    int insertTranscation(int productId, String buyerId, String writer, String productName, String locationName, Integer price);
}