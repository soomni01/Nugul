CREATE TABLE product_file
(
    product_id INT          NOT NULL REFERENCES product (product_id),
    name       VARCHAR(300) NOT NULL,
    PRIMARY KEY (product_id, name)
);

# 메인 이미지 추가
ALTER TABLE product_file
    ADD COLUMN is_main BOOLEAN DEFAULT FALSE;

DESC product_file;

ALTER TABLE product_file
    DROP COLUMN is_main;
