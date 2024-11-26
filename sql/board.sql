CREATE TABLE board
(
    board_id   INT PRIMARY KEY AUTO_INCREMENT,
    title      VARCHAR(255)  NOT NULL,
    content    VARCHAR(1000) NOT NULL,
    writer     VARCHAR(50)   NOT NULL REFERENCES member (member_id),
    category   VARCHAR(50)   NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
);
