CREATE TABLE inquiry
(
    inquiry_id INT PRIMARY KEY AUTO_INCREMENT,
    title      VARCHAR(255)  NOT NULL,
    content    VARCHAR(1000) NOT NULL,
    member_id  VARCHAR(50)   NOT NULL REFERENCES member (member_id),
    answer     VARCHAR(1000),
    inserted   DATE DEFAULT CURRENT_DATE
);

DROP TABLE inquiry;

SELECT *
FROM inquiry;

ALTER TABLE inquiry
    ADD COLUMN nickname VARCHAR(50);

ALTER TABLE inquiry
    ADD CONSTRAINT unique_nickname UNIQUE (nickname);

DESC inquiry;

ALTER TABLE inquiry
    ADD COLUMN category ENUM ('신고', '이용 안내', '계정 문의', '기타 문의') NOT NULL AFTER member_id;

ALTER TABLE inquiry
    DROP COLUMN nickname;