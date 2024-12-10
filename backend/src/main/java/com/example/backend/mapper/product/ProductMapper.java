package com.example.backend.mapper.product;

import com.example.backend.dto.product.Product;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

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
            SELECT  p.product_id, p.product_name, p.price, p.writer, p.category, p.description, p.created_at, p.pay, p.latitude, p.longitude, p.location_name, m.nickname
            FROM product p
            LEFT JOIN member m ON p.writer = m.member_id
            WHERE product_id = #{productId}
            """)
    Product selectById(Integer productId);

    @Delete("""
            DELETE FROM product
            WHERE product_id = #{id}
            """)
    int deleteById(int id);

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
                SELECT p.*, pf.name AS main_image_name
                FROM product p
                LEFT JOIN product_file pf ON p.product_id = pf.product_id AND pf.is_main = TRUE
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
            """)
    int deleteLike(Integer productId);

    @Insert("""
            INSERT INTO product_like
            VALUES (#{productId}, #{name})
            """)
    int insertLike(Integer productId, String name);

    @Select("""
            SELECT COUNT(*)
            FROM product_like
            WHERE product_id = #{productId}
            """)
    int countLike(Integer productId);

    @Select("""
            SELECT product_id, COUNT(*) as like_count
            FROM product_like
            GROUP BY product_id;
            """)
    List<Map<String, Object>> countLikeByProductId();

    @Select("""
            SELECT product_id
            FROM product_like
            WHERE member_id = #{memberId}
            """)
    List<Integer> likedProductByMemberId(String memberId);

    @Select("""
            SELECT p.*, pf.name AS main_image_name
            FROM product p
            LEFT JOIN product_file pf ON p.product_id = pf.product_id AND pf.is_main = TRUE
            WHERE pay = 'sell'
            AND status = 'For Sale'
            ORDER BY product_id DESC
            LIMIT #{limit}
            """)
    List<Product> selectSellProducts(Integer limit);

    @Select("""
            SELECT p.*, pf.name AS main_image_name
            FROM product p
            LEFT JOIN product_file pf ON p.product_id = pf.product_id AND pf.is_main = TRUE
            WHERE pay = 'share'
            AND status = 'For Sale'
            ORDER BY product_id DESC
            LIMIT #{limit}
            """)
    List<Product> selectShareProducts(Integer limit);

    @Delete("""
            DELETE FROM purchased_record
            WHERE product_id = #{productId}
            """)
    int deletePurchasedRecord(Integer productId);

    @Select("""
            SELECT product_id
            FROM product
            WHERE writer = #{memberId}
            """)
    List<Integer> getProductId(String memberId);

    @Delete("""
            DELETE FROM product_like
            WHERE product_id = #{productId}
            AND member_id = #{name}
            """)
    int deleteLikeByMemberId(Integer productId, String name);

    @Update("""
            UPDATE product
            SET status = 'Sold'
            WHERE product_id = #{id}
            """)
    int updateProductStatus(int id);

    @Insert("""
            Insert purchased_record
            (buyer_id, product_id, seller_id, product_name, location_name, price)
            VALUES (#{buyerId}, #{id}, #{writer}, #{productName}, #{locationName}, #{price})
            """)
    int insertTranscation(int id, String buyerId, String writer, String productName, String locationName, Integer price);

    @Select("""
            SELECT name
            FROM product_file
            WHERE product_id = #{productId}
            """)
    List<String> selectFilesByProductId(Integer productId);

    @Delete("""
            DELETE FROM product_file
            WHERE product_id = #{id}
            """)
    int deleteFileByProductId(int id);

    @Update("""
            UPDATE product_file
            SET is_main=#{isMain}
            WHERE product_id = #{productId} AND name=#{originalFilename}
            """)
    int updateFile(Integer productId, String originalFilename, boolean isMain);

    @Delete("""
            DELETE FROM product_file
            WHERE product_id = #{productId}
              AND name = #{name}
            """)
    int deleteFile(Integer productId, String name);
}
