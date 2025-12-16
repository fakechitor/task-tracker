CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(64) NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'CREATED' CHECK (status in ('CREATED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED') ),
    deadline DATE,
    priority SMALLINT CHECK (priority BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
