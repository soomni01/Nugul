CREATE TABLE product
(
    product_id   INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(50)  NOT NULL,
    price        INT          NOT NULL,
    description  VARCHAR(300),
    writer       VARCHAR(50)  NOT NULL REFERENCES member (member_id),
    free         boolean      NOT NULL,
    category     VARCHAR(100) NOT NULL,
    status       ENUM ('For Sale', 'Sold') DEFAULT 'For Sale',
    created_at   DATE                      DEFAULT CURRENT_DATE
);
