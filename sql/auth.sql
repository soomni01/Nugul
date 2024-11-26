CREATE TABLE auth
(
    member_id VARCHAR(50) REFERENCES member (member_id),
    auth      VARCHAR(50) NOT NULL,
    PRIMARY KEY (member_id, auth)
);