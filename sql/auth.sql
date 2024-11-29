CREATE TABLE auth
(
    member_id VARCHAR(50) REFERENCES member (member_id),
    auth      VARCHAR(50) NOT NULL,
    PRIMARY KEY (member_id, auth)
);

INSERT INTO auth (member_id, auth)
VALUES ('mk@naver.com', 'admin');