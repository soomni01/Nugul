CREATE TABLE comment
(
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    board_id   INT          NOT NULL REFERENCES board (board_id),
    member_id  VARCHAR(50)  NOT NULL REFERENCES member (member_id),
    comment    VARCHAR(300) NOT NULL,
    inserted   DATETIME     NOT NULL DEFAULT NOW()
);