CREATE TABLE expense_record
(
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id    VARCHAR(50) REFERENCES member (member_id),
    product_id INT REFERENCES product (product_id),
    date       DATE DEFAULT CURRENT_DATE
);

RENAME TABLE buy_record TO purchased_record;

# 구매자 구분 쉽게 컬럼명 변경
ALTER TABLE purchased_record
    RENAME COLUMN user_id TO buyer_id;

INSERT INTO purchased_record (buyer_id, product_id)
VALUES ('sm@naver.com', 55);

DESC purchased_record;

SELECT *
FROM purchased_record;

INSERT INTO purchased_record (buyer_id, product_id, date, seller_id, product_name, location_name, review_status, price)
VALUES ('coogie@naver.com', 130, '2024-12-09', 'sy@naver.com', '상품1', 'Seoul', 'uncompleted', 1111);

INSERT INTO purchased_record (buyer_id, product_id, date, seller_id, product_name, location_name, review_status, price)
VALUES ('coogie@naver.com', 131, '2024-12-09', '@naver.com', '상품2', 'Seoul', 'uncompleted', 2222);

SELECT DATE_FORMAT(created_at, '%Y-%m')                                 AS month,
       SUM(CASE WHEN writer = 'coogie@naver.com' THEN price ELSE 0 END) AS total_sales
FROM product
WHERE status = 'For Sale';


SELECT DATE_FORMAT(date, '%Y-%m')                                         AS month,
       SUM(CASE WHEN buyer_id = 'coogie@naver.com' THEN price ELSE 0 END) AS total_purchases
FROM purchased_record;
