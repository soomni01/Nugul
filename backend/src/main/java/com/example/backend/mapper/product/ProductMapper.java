package com.example.backend.mapper.product;

import com.example.backend.dto.product.Product;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProductMapper {
    @Insert("""
            INSERT INTO product
            (product_name, price, description, writer, pay, category,  latitude, longitude, location_name)
            VALUES (#{productName}, #{price}, #{description}, #{writer}, #{pay}, #{category}, #{latitude}, #{longitude}, #{locationName})
            """)
    @Options(keyProperty = "productId", useGeneratedKeys = true)
    int insert(Product product);

    @Insert("""
            INSERT INTO product_file
            VALUES (#{id}, #{fileName}, #{isMain})
            """)
    int insertFile(Integer id, String fileName, boolean isMain);

    @Select("""
            SELECT p.product_id, p.product_name, p.price, p.category, p.pay, f.name as mainImage
            FROM product p
            LEFT OUTER JOIN product_file f 
            ON p.product_id = f.product_id AND f.is_main = TRUE
            ORDER BY p.product_id DESC
            """)
    List<Product> getProductList();

    @Select("""
            SELECT  p.product_id, p.product_name, p.price, p.category, p.description, p.created_at, p.pay, p.latitude, p.longitude, p.location_name, m.nickname
            FROM product p
            JOIN member m ON p.writer = m.member_id
            WHERE product_id = #{id}
            """)
    Product selectById(int id);

    @Delete("""
            DELETE FROM product
            WHERE product_id = #{id}
            """)
    int deleteById(int id);

    @Delete("""
            DELETE FROM product_file
            WHERE product_id = #{id}
            """)
    int deleteFileByProductId(int id);

    @Update("""
            UPDATE product
            SET product_name = #{productName},
                description = #{description},
                category = #{category},
                price = #{price},
                pay = #{pay},
                latitude = #{latitude},
                longitude = #{longitude},
                location_name = #{locationName}
                WHERE product_id = #{productId}
            """)
    int update(Product product);

    @Select("""
            <script>
                SELECT *
                 FROM product
                <where>
                    <if test="category != null and category != 'all'">
                        AND category = #{category}
                    </if>
                    <if test="keyword != null and keyword != ''">
                        AND product_name LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                        AND pay = #{pay}
                        AND status = 'For Sale'
                </where>
                ORDER BY product_id DESC
                LIMIT #{offset}, 16
            </script>
            """)
    List<Product> selectPage(Integer offset, String category, String keyword, String pay);

    @Select("""
            <script>
                SELECT COUNT(*)
                FROM product
                <where>
                    <if test="category != null and category != 'all'">
                        AND category = #{category}
                    </if>
                    <if test="keyword != null and keyword != ''">
                        AND product_name LIKE CONCAT('%', #{keyword}, '%')
                    </if>
                        AND pay = #{pay}
                        AND status = 'For Sale'
                </where>
            </script>
            """)
    Integer countAll(String category, String keyword, String pay);

    @Delete("""
            DELETE FROM product_like
            WHERE product_id = #{productId}
            AND member_id = #{name}
            """)
    int deleteLikeByProductAndMemberId(Integer productId, String name);

    @Insert("""
            INSERT INTO product_like
            VALUES (#{productId}, #{name})
            """)
    int insertLike(Integer productId, String name);
}
