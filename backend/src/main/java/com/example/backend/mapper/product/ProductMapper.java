package com.example.backend.mapper.product;

import com.example.backend.dto.product.Product;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductMapper {
    @Insert("""
            INSERT INTO product
            (product_name, price, description, writer, pay, category,  latitude, longitude, location_name)
            VALUES (#{productName}, #{price}, #{description}, #{writer}, #{pay}, #{category}, #{latitude}, #{longitude}, #{locationName})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Product product);

    @Insert("""
            INSERT INTO product_file
            VALUES (#{id}, #{fileName})
            """)
    int insertFile(Integer id, String fileName);

    @Select("""
            SELECT *
            FROM product p
            LEFT OUTER JOIN product_file f ON p.product_id = f.product_id
            WHERE f
            ORDER BY p.product_id DESC
            """)
    List<Product> getProductList();
}
