CREATE TABLE user_addresses (
    address_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    address_type ENUM('home', 'work', 'legal') NOT NULL,
    house_no VARCHAR(50),
    street_no VARCHAR(50),
    block_no VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(20),
    state VARCHAR(20),
    country VARCHAR(20),
    pincode VARCHAR(20),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    valid_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);