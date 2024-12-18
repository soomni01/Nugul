USE prj1126;

CREATE TABLE board_file
(
    board_id INT          NOT NULL REFERENCES board (board_id),
    name     VARCHAR(300) NOT NULL,
    url      VARCHAR(500),
    PRIMARY KEY (board_id, name)
);

ALTER TABLE board_file
    ADD COLUMN url VARCHAR(500);

SELECT *
FROM board_file;
