USE prj1126;

CREATE TABLE board_file
(
    board_id INT          NOT NULL REFERENCES board (board_id),
    name     VARCHAR(300) NOT NULL,
    PRIMARY KEY (board_id, name)
);

ALTER TABLE board_file
    ADD COLUMN url VARCHAR(500);

ALTER TABLE board_file
    DROP COLUMN url;

SELECT *
FROM board_file;
