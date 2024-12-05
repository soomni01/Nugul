CREATE TABLE review
(
    review_id     INT PRIMARY KEY AUTO_INCREMENT,
    product_id    INT         REFERENCES product (product_id) ON DELETE SET NULL, # 상품 삭제해도 후기는 남게
    product_name  VARCHAR(50),
    buyer_id      VARCHAR(50) REFERENCES member (member_id) ON DELETE SET NULL,
    buyer_name    VARCHAR(50),                                                    # 작성자 삭제 시 알수없음 표시
    review_text   TEXT        NOT NULL,
    rating        INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    seller_id     VARCHAR(50),
    price         INT,
    review_status ENUM ('uncompleted', 'completed') DEFAULT 'uncompleted',
    created_at    DATE                              DEFAULT CURRENT_DATE
);

# product_name, price 는 상품 삭제돼도 어떤 상품인지 정보 보여주기
