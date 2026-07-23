-- UUIDv7 generator function for PostgreSQL
-- Produces RFC 9562-compliant Version 7 UUIDs (timestamp-ordered)
-- This ensures sequential B-Tree index inserts for high-write tables.
--
-- When PostgreSQL 18 ships native uuidv7(), this function can be dropped.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION uuidv7() RETURNS uuid AS $$
DECLARE
  unix_ts_ms bytea;
  uuid_bytes bytea;
BEGIN
  -- 48-bit Unix timestamp in milliseconds
  unix_ts_ms = substring(
    int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint)
    FROM 3
  );

  -- 10 random bytes for rand_a (12 bits) + rand_b (62 bits)
  uuid_bytes = unix_ts_ms || gen_random_bytes(10);

  -- Set version to 7 (bits 48–51 = 0111)
  uuid_bytes = set_byte(
    uuid_bytes, 6,
    (b'0111' || get_byte(uuid_bytes, 6)::bit(4))::bit(8)::int
  );

  -- Set variant to 2 (bits 64–65 = 10)
  uuid_bytes = set_byte(
    uuid_bytes, 8,
    (b'10' || get_byte(uuid_bytes, 8)::bit(6))::bit(8)::int
  );

  RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;
