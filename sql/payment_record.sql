CREATE TABLE payment_record
(
    imp_uid        VARCHAR(100) PRIMARY KEY  NOT NULL, -- 결제 고유 ID
    buyer_id       VARCHAR(50)               NOT NULL, -- 구매자 ID
    product_name   VARCHAR(255)              NOT NULL, -- 결제한 상품명
    payment_amount DECIMAL(10, 2)            NOT NULL, -- 결제 금액
    payment_method VARCHAR(50),                        -- 결제 방법
    payment_date   DATE DEFAULT CURRENT_DATE NOT NULL, -- 결제 일시
    status         VARCHAR(20),                        -- 결제 상태
    FOREIGN KEY (buyer_id) REFERENCES member (member_id)
);

SELECT *
FROM payment_record;

DESC payment_record;

DROP TABLE payment_record;

ALTER TABLE payment_record
    ADD COLUMN product_id INT NOT NULL, -- 상품 ID 컬럼 추가
    ADD FOREIGN KEY (product_id) REFERENCES product (product_id);