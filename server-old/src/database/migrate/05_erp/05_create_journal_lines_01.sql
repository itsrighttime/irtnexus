CREATE TABLE journal_lines (
    line_id BINARY(16) PRIMARY KEY,
    journal_id BINARY(16) NOT NULL,
    account_id BINARY(16) NOT NULL,
    debit DECIMAL(18,4) DEFAULT 0,
    credit DECIMAL(18,4) DEFAULT 0,
    FOREIGN KEY (journal_id) REFERENCES journal_entries(journal_id),
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id)
);