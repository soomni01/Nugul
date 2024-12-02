CREATE TABLE likes
(
    like_id    INT PRIMARY KEY AUTO_INCREMENT,
    member_id  VARCHAR(50) NOT NULL REFERENCES member (member_id),
    product_id INT REFERENCES product (product_id)
);

RENAME TABLE likes TO product_like;
