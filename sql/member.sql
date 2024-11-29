CREATE TABLE member
(
    member_id VARCHAR(50) PRIMARY KEY,
    password  VARCHAR(50)        NOT NULL,
    name      VARCHAR(50)        NOT NULL,
    nickname  VARCHAR(50) UNIQUE NOT NULL,
    inserted  DATE DEFAULT CURRENT_DATE
);


select *
from member;