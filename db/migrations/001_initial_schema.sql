-- Tabela: projects
CREATE TABLE IF NOT EXISTS projects (
  -- Identificação e sistema
  id              SERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug            VARCHAR(200) NOT NULL UNIQUE,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  status          VARCHAR(20) NOT NULL DEFAULT 'in_progress'
                    CHECK (status IN ('in_progress', 'completed')),

  -- Card (feed)
  title           VARCHAR(150) NOT NULL,
  description     TEXT NOT NULL,
  cover_image     VARCHAR(500),
  tags            TEXT[] NOT NULL DEFAULT '{}',

  -- Post completo
  problem_solved  TEXT,
  learnings       TEXT,
  challenges      TEXT,
  dev_process     TEXT,
  ai_usage        TEXT,
  next_steps      TEXT,
  repo_url        VARCHAR(500)
);

-- Tabela: thoughts
CREATE TABLE IF NOT EXISTS thoughts (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug        VARCHAR(200) NOT NULL UNIQUE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  content     TEXT NOT NULL,
  tags        TEXT[] NOT NULL DEFAULT '{}'
);
