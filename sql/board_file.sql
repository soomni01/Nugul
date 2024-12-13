USE prj1126;

CREATE TABLE board_file
(
    board_id INT          NOT NULL REFERENCES board (board_id),
    name     VARCHAR(300) NOT NULL,
    PRIMARY KEY (board_id, name)
);
