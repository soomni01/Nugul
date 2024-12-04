CREATE TABLE chat_message
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    roomId  int         NOT NULL REFERENCES chatroom (roomId),
    sender  VARCHAR(50) NOT NULL,
    content TEXT        NOT NULL,
    sent_at DATETIME default now()
);

DROP TABLE chat_message;
DESC chat_message;

select *
from chat_message
where roomId = 42
order by id desc
limit 0,5;


select *
from chat_message;

delete
from chat_message
where roomId = 46;