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


#  삭제 여부 확인
ALTER TABLE chatroom
    ADD COLUMN iswriter_deleted BOOLEAN DEFAULT FALSE,
    ADD COLUMN isbuyer_deleted  BOOLEAN DEFAULT FALSE;

ALTER TABLE chatroom
    ADD COLUMN writer_leave_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN buyer_leave_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

# 변경일 : 2024/12/11 14:37
# chatroom 테이블 변경 product_id 컬럼 추가
# 참조 제약사항은 걸지 않음.. 필요하면 수정해주세요.
# 나중에 product_name이 필요 없다면 지우기... (혹시 몰라서 남겨둠)
ALTER TABLE chatroom
    ADD COLUMN product_id INT AFTER roomId;

SELECT c.*,
       p.status AS status
FROM chatroom c
         LEFT JOIN
     product p
     ON
         c.product_id = p.product_id
order by roomId desc;
delete
from chat_message
where roomId = 50;


select c.*, p.status as product_status
from chatroom c
         left join product p on c.product_id = p.product_id
         join member m
where roomId = 93;


desc chatroom;

ALTER TABLE chatroom
    ADD CONSTRAINT fk_writer FOREIGN KEY (writer) REFERENCES member (member_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_buyer FOREIGN KEY (buyer) REFERENCES member (member_id) ON DELETE SET NULL;