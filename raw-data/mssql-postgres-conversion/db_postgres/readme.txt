````markdown
# Importing ONET SQL Files into PostgreSQL on OpenMandriva

## Problem
Needed to import 40 ordered SQL files from `/tmp/onet/` into the `train_reward_compare` PostgreSQL database.

## Steps Taken

### 1. Finding psql
psql was not in the default PATH for the postgres user. Located it with:
```bash
which psql || find /usr -name psql 2>/dev/null
```
Found at `/usr/local/pgsql/bin/psql` (non-standard location due to OpenMandriva breaking changes).

### 2. Fix PATH
```bash
export PATH=$PATH:/usr/local/pgsql/bin
```

### 3. Create the onet Schema
The SQL files all begin with `SET search_path TO onet;` so the schema needed to exist first:
```bash
/usr/local/pgsql/bin/psql -d train_reward_compare -c "CREATE SCHEMA IF NOT EXISTS onet;"
```

### 4. Import All Files in Order
Files are numbered `01_` through `40_` to enforce dependency order. Run them in sequence:
```bash
for f in $(ls /tmp/onet/*.sql | sort); do
    echo "Importing $f..."
    psql -d train_reward_compare -f "$f" || { echo "FAILED on $f"; break; }
done
```
Successful inserts show as `INSERT 0 1` per row — this is normal.

### 5. Monitor Progress in pgAdmin4
Open Query Tool against `train_reward_compare` and run:
```sql
SELECT schemaname, relname, n_live_tup 
FROM pg_stat_user_tables 
WHERE schemaname = 'onet'
ORDER BY relname;
```
Re-run periodically to watch row counts climb.
````
