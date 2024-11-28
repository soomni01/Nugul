CREATE TABLE member
(
    member_id VARCHAR(50) PRIMARY KEY,
    password  VARCHAR(50)        NOT NULL,
    name      VARCHAR(50)        NOT NULL,
    nickname  VARCHAR(50) UNIQUE NOT NULL,
    inserted  DATE DEFAULT CURRENT_DATE
);

INSERT INTO member (member_id, password, name, nickname, inserted)
VALUES ('coogie@naver.com', '1234', 'Coogie', 'Coogie', CURRENT_DATE);

SELECT *
FROM member;