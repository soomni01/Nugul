CREATE TABLE checkbox
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    name     VARCHAR(255) NOT NULL,
    checked  BOOLEAN      NOT NULL DEFAULT FALSE
);

DROP TABLE checkbox;
