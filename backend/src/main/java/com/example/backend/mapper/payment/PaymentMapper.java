package com.example.backend.mapper.payment;

import com.example.backend.dto.payment.PaymentDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentMapper {
    @Insert("""
            INSERT INTO payment_record (imp_uid, buyer_id, product_id, product_name, payment_amount, payment_method, payment_date, status)
            VALUES (#{impUid}, #{buyerId}, #{productId}, #{productName}, #{paymentAmount}, #{paymentMethod}, #{paymentDate}, #{status})
            """)
    void savePayment(PaymentDTO payment);
}