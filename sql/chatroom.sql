#  확인용이라  참조 안해놓음
create table chatroom
(
    roomId      int AUTO_INCREMENT primary key,
    productName varchar(50) not null,
    writer      varchar(50) not null
);

select *
from chatroom;

select *
from chatroom join  member


delete
from chatroom;

drop table chatroom;