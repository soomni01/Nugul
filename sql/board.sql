CREATE TABLE board
(
    board_id   INT PRIMARY KEY AUTO_INCREMENT,
    title      VARCHAR(255)  NOT NULL,
    content    VARCHAR(1000) NOT NULL,
    writer     VARCHAR(50)   NOT NULL REFERENCES member (member_id),
    category   VARCHAR(50)   NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
);

DESCRIBE board;

show CREATE TABLE board;
/*CREATE TABLE `board`
(
    `board_id`   int(11)       NOT NULL AUTO_INCREMENT,
    `title`      varchar(255)  NOT NULL,
    `content`    varchar(5000) NOT NULL,
    `writer`     varchar(50)   NOT NULL,
    `category`   varchar(50)   NOT NULL,
    `created_at` date DEFAULT curdate(),
    PRIMARY KEY (`board_id`),
    KEY `writer` (`writer`),
    CONSTRAINT `board_ibfk_1` FOREIGN KEY (`writer`) REFERENCES `member` (`member_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 52
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_uca1400_ai_ci*/

SELECT
    b.board_id,
    b.title,
    b.content,
    b.writer AS memberId,  -- 실제 DB에서 memberId를 나타내는 writer
    m.nickname AS writer,  -- 실제 작성자의 nickname
    b.category,
    b.created_at
FROM
    board b
        JOIN
    member m ON b.writer = m.nickname  -- board 테이블의 writer와 member 테이블의 nickname 연결
WHERE
    m.nickname = '이대로';