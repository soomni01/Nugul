#  확인용이라  참조 안해놓음
create table chatroom
(
    roomId      int AUTO_INCREMENT primary key,
    productName varchar(50) not null,
    writer      varchar(50) not null
);

ALTER TABLE chatroom
    CHANGE COLUMN sender nickname VARCHAR(50) NOT NULL DEFAULT 'Unknown';


ALTER TABLE chatroom
    ADD CONSTRAINT writer
        FOREIGN KEY (writer) REFERENCES member (member_id);

select *
from chatroom;

select *
from chatroom
         join member;

desc chatroom;


select *
from chatroom
where writer = "3"
order by roomId desc

