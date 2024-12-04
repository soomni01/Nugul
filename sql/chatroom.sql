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

alter table chatroom
    change column buyerId buyer varchar(50) not null default 'buyer';

select *
from chatroom;



desc chatroom;






