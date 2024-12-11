CREATE TABLE payment_record
(
    payment_id     SERIAL PRIMARY KEY,
    imp_uid        VARCHAR(100)              NOT NULL, -- 결제 고유 ID
    buyer_id       VARCHAR(50)               NOT NULL, -- 구매자 ID
    product_id     INT                       NOT NULL, -- 결제한 상품 ID
    product_name   VARCHAR(255)              NOT NULL, -- 결제한 상품명
    payment_amount DECIMAL(10, 2)            NOT NULL, -- 결제 금액
    payment_method VARCHAR(50),                        -- 결제 방법
    payment_date   DATE DEFAULT CURRENT_DATE NOT NULL, -- 결제 일시
    status         VARCHAR(20),                        -- 결제 상태
    FOREIGN KEY (buyer_id) REFERENCES member (member_id),
    FOREIGN KEY (product_id) REFERENCES product (product_id)
);

DESC payment_record;
