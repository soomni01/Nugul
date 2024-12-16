package com.example.backend.mapper.payment;

import com.example.backend.dto.payment.PaymentRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PaymentMapper {
    @Insert("""
            INSERT INTO payment_record (imp_uid, buyer_id, product_name, payment_amount, payment_method, payment_date, status)
            VALUES (#{impUid}, #{buyerId}, #{productName}, #{paymentAmount}, #{paymentMethod}, #{paymentDate}, #{status})
            """)
    int savePayment(PaymentRecord paymentrecord);

    @Select("""
            SELECT *
            FROM payment_record 
            WHERE buyer_id = #{buyerId}
            """)
    List<PaymentRecord> getPayment(String buyerId);
}