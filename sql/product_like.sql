CREATE TABLE product_like
(
    product_id INT REFERENCES product (product_id),
    member_id  VARCHAR(50) NOT NULL REFERENCES member (member_id),
    PRIMARY KEY (product_id, member_id)
);

SELECT *
FROM product_like;