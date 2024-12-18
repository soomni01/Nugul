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


# seller_id 컬럼 추가
ALTER TABLE purchased_record
    ADD COLUMN seller_id VARCHAR(50);

DESC purchased_record;

ALTER TABLE purchased_record
    ADD CONSTRAINT fk_buyer FOREIGN KEY (buyer_id)
        REFERENCES member (member_id) ON DELETE SET NULL;

ALTER TABLE purchased_record
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES product (product_id) ON DELETE SET NULL;

# 삭제 시 사용할 컬럼 추가
ALTER TABLE purchased_record
    ADD COLUMN product_name VARCHAR(50) NOT NULL,
    ADD COLUMN location_name VARCHAR(100) NOT NULL,
    ADD COLUMN review_status ENUM ('uncompleted', 'completed') DEFAULT 'uncompleted'
    ADD COLUMN price INT NOT NULL;

DESC purchased_record;

SELECT *
FROM purchased_record;

SELECT DATE_FORMAT(created_at, '%Y-%m')                                 AS month,
       SUM(CASE WHEN writer = 'coogie@naver.com' THEN price ELSE 0 END) AS total_sales
FROM product
WHERE status = 'For Sale';


SELECT DATE_FORMAT(date, '%Y-%m')                                         AS month,
       SUM(CASE WHEN buyer_id = 'coogie@naver.com' THEN price ELSE 0 END) AS total_purchases
FROM purchased_record;

ALTER TABLE purchased_record
    ADD COLUMN payment_status ENUM ('Not Paid', 'Paid') DEFAULT 'Not Paid';

ALTER TABLE purchased_record
    DROP COLUMN payment_status;