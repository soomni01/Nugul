CREATE TABLE chat
(
    chat_id     INT PRIMARY KEY AUTO_INCREMENT,
    sender_id   VARCHAR(50)  NOT NULL,
    receiver_id VARCHAR(50) REFERENCES product (writer),
    message     VARCHAR(100) NOT NULL,
    product_id  INT REFERENCES product (product_id),
    sent_at     DATE DEFAULT CURRENT_DATE
);
