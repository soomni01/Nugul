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
WHERE member_id = 'sm@naver.com';

# 프로필 이미지 컬럼 추가
ALTER TABLE member
    ADD COLUMN profile_image VARCHAR(300) DEFAULT NULL;

# 카카오 로그인 시 비밀번호 미사용
ALTER TABLE member
    MODIFY COLUMN password VARCHAR(50) NULL;



ALTER TABLE member
    MODIFY is_deleted BOOLEAN DEFAULT FALSE;
