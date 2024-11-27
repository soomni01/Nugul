package com.example.backend.mapper.product;

import com.example.backend.dto.product.Product;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface ProductMapper {
    @Insert("""
            INSERT INTO product
            (product_name, price, description, writer, free, category, status)
            VALUES (#{productName}, #{price}, #{description}, #{writer}, #{free}, #{category}, #{status})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Product product);
}
