CREATE TABLE expense_record
(
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id    VARCHAR(50) REFERENCES member (member_id),
    product_id INT REFERENCES product (product_id),
    date       DATE DEFAULT CURRENT_DATE
);

RENAME TABLE buy_record TO purchased_record;

SELECT *
FROM purchased_record;

DESC purchased_record;

SELECT *
FROM purchased_record
WHERE buyer_id = 'sm@naver.com'; -- 또는 user_id 필드 사용
