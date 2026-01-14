
CREATE TABLE IF NOT EXISTS issue_likes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    issue_id INTEGER NOT NULL REFERENCES issue_reports(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, issue_id)
);

ALTER TABLE issue_reports ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
