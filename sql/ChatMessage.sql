CREATE TABLE ChatMessage
(
    content    VARCHAR(100),
    sender     VARCHAR(50),
    created_at DATE DEFAULT now()
);

drop table ChatMessage;