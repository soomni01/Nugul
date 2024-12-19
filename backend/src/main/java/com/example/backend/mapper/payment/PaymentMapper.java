package com.example.backend.mapper.payment;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Map;

@Mapper
public interface PaymentMapper {

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

    @Select("""
            SELECT 
                cr.product_id AS productId,
                cr.buyer AS buyerId,
                p.writer AS writer,
                p.product_name AS productName,
                p.location_name AS locationName,
                p.price AS price
            FROM chatroom cr
            LEFT JOIN product p ON cr.product_id = p.product_id
            WHERE cr.roomId = #{roomId}
            """)
    Map<String, Object> getTransactionInfoByRoomId(int roomId);

    @Insert("""
            INSERT INTO purchased_record(buyer_id, product_id, seller_id, product_name, location_name, price, payment_method)
            VALUES (#{buyerId}, #{productId}, #{writer}, #{productName}, #{locationName}, #{price}, #{paymentMethod})
            """)
    int insertTransaction(int productId, String buyerId, String writer, String productName, String locationName, Integer price, String paymentMethod);
}