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