-- RitiMail — schema do banco D1 (Cloudflare)
-- Execute com: wrangler d1 execute ritimail --file=./schema.sql

CREATE TABLE IF NOT EXISTS addresses (
  address    TEXT PRIMARY KEY,
  token      TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_addresses_token ON addresses(token);

CREATE TABLE IF NOT EXISTS messages (
  id         TEXT PRIMARY KEY,
  address    TEXT NOT NULL,
  from_addr  TEXT,
  subject    TEXT,
  text_body  TEXT,
  html_body  TEXT,
  created_at INTEGER NOT NULL,
  seen       INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (address) REFERENCES addresses(address)
);
CREATE INDEX IF NOT EXISTS idx_messages_address ON messages(address);
