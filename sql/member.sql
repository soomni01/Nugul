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

INSERT INTO member (member_id, password, name, nickname, inserted)
VALUES ('mk@naver.com', '1234', 'mk', 'mk', CURRENT_DATE);

SELECT *
FROM member;

DELETE
FROM member;


# ALTER TABLE member
#     DROP COLUMN name;

DESCRIBE member;

DESC member;

UPDATE member
SET password =1234
WHERE member_id = 'sm@naver.com'