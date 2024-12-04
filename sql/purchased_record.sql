CREATE TABLE expense_record
(
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id    VARCHAR(50) REFERENCES member (member_id),
    product_id INT REFERENCES product (product_id),
    date       DATE DEFAULT CURRENT_DATE
);

RENAME TABLE expense_record TO purchased_record;

# 구매자 구분 쉽게 컬럼명 변경
ALTER TABLE purchased_record
    RENAME COLUMN user_id TO buyer_id;

INSERT INTO purchased_record (buyer_id, product_id)
VALUES ('sm@naver.com', 56);
