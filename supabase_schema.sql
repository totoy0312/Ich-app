-- 用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT DEFAULT '🐱',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 预约表
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  cat_id TEXT NOT NULL,
  cat_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  people INTEGER DEFAULT 1,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 作品表
CREATE TABLE works (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  cat_id TEXT NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 兴趣投票表
CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  ich_name TEXT NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ich_name, username)
);

-- 查询投票统计的函数
CREATE OR REPLACE FUNCTION get_interests()
RETURNS TABLE(ich_name TEXT, count BIGINT)
LANGUAGE SQL AS $$
  SELECT ich_name, COUNT(*) as count
  FROM interests
  GROUP BY ich_name
  ORDER BY count DESC;
$$;
