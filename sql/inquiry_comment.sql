CREATE TABLE inquiry_comment
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    inquiry_id INT         NOT NULL,
    admin_id   VARCHAR(50) NOT NULL,
    comment    VARCHAR(300),
    inserted   DATE        NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (inquiry_id) REFERENCES inquiry (inquiry_id),
    FOREIGN KEY (admin_id) REFERENCES auth (member_id)
);

DESC inquiry_comment;

DROP TABLE inquiry_comment;

SELECT *
FROM inquiry_comment;

DELETE
FROM inquiry_comment;

ALTER TABLE inquiry_comment
    DROP FOREIGN KEY inquiry_comment_ibfk_1; -- 기존 외래 키 제약 조건을 삭제

ALTER TABLE inquiry_comment
    ADD CONSTRAINT inquiry_comment_ibfk_1
        FOREIGN KEY (inquiry_id) REFERENCES inquiry (inquiry_id)
            ON DELETE CASCADE; -- 'inquiry' 삭제 시, 연관된 'inquiry_comment' 자동 삭제