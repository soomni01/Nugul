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

alter table chatroom
    add  column writerDelete

select *
from chatroom;

desc chatroom;


#  삭제 여부 확인
ALTER TABLE chatroom
    ADD COLUMN iswriter_deleted BOOLEAN DEFAULT FALSE,
    ADD COLUMN isbuyer_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE chatroom
    ADD COLUMN writer_leave_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN buyer_leave_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

# 변경일 : 2024/12/11 14:37
# chatroom 테이블 변경 product_id 컬럼 추가
# 참조 제약사항은 걸지 않음.. 필요하면 수정해주세요.
# 나중에 product_name이 필요 없다면 지우기... (혹시 몰라서 남겨둠)
ALTER TABLE chatroom
    ADD COLUMN product_id INT AFTER roomId;