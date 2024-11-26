CREATE TABLE product_file
(
    product_id INT          NOT NULL REFERENCES product (product_id),
    name       VARCHAR(300) NOT NULL,
    PRIMARY KEY (product_id, name)
);