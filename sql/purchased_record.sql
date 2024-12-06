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

INSERT INTO purchased_record (buyer_id, product_id, seller_id)
VALUES ('tt@tt.tt', 34, 'sm@naver.com')

DESC purchased_record;

ALTER TABLE purchased_record
    ADD CONSTRAINT fk_buyer FOREIGN KEY (buyer_id)
        REFERENCES member (member_id) ON DELETE SET NULL;

ALTER TABLE purchased_record
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES product (product_id) ON DELETE SET NULL;