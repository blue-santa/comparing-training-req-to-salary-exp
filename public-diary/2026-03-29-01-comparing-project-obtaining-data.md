Project Diary
=============

# A Quick Background Note

For clarity and transparency, when I first began outlining this project and before I had started posting anything online, I discussed my project ideas with Claude AI. 

I had a list of recommended starting points from Springboard Academy for where I could search for useful datasets. I discussed my ideas with Claude and, as I discovered different sets, we talked over various pros and cons of each route.

In the end, with the help of Claude, I narrowed down my options to three primary ideas.

These ideas were the basis of a conversation with my mentor, where we decided to focus on the `O*NET` and `BLS Wage` datasets.

# Step One : Deciding on Downloading Datasets

Beginning with the `O*NET` dataset, I am looking at the collection of files. There are many different options and, at this stage, I'm not sure what is and is not relevant.

My first inclination is to download the entire collection and sift through the data. The idea here would be to gain an initial mental vocabulary over what the dataset offers.

This would apply with the `BLS Wage` dataset as well.

The data will be stored in PostgreSQL, with backups being stored as `.sql` files in my git repository.  

There are a few different options for download. I could work with Excel files, or `.txt` files, or even a `MySQL` file. 

To save on time, I'm going to ask Claude AI for help deciding which file format is the best starting point.

Here is Claude's response:

```
For your use case, I'd skip MySQL and go straight to the SQL Server or plain text/Excel formats — but actually, the best path for O*NET + BLS data into PostgreSQL is probably simpler than you're thinking.

Here's my reasoning:

**On MySQL specifically:** Yes, you *can* convert MySQL dumps to PostgreSQL, but it's a headache. MySQL and PostgreSQL have enough syntax differences (data types, auto-increment, quoting conventions) that a direct import usually requires cleanup. Tools like `pgloader` smooth this out considerably, but it's an extra step with potential gotchas.

**What I'd actually recommend:**

The **Text (tab-delimited)** format is your best friend here. O*NET's text files are clean, well-documented, and map directly to table names. The workflow becomes:

1. Load .txt files into pandas DataFrames
2. Use SQLAlchemy's df.to_sql() to push them into PostgreSQL
3. Done — no format conversion, full control over schema and types

This is also more reproducible and easier to document for your capstone portfolio, since the ETL logic lives transparently in your notebook.

**If you want a pre-built schema**, the SQL Server format gives you CREATE TABLE statements you can adapt for PostgreSQL with minimal changes — mostly swapping INT IDENTITY for SERIAL or BIGINT GENERATED ALWAYS AS IDENTITY, and adjusting a few type names. That could save you time designing the schema from scratch.

**My recommendation:** Text files for the actual data load, SQL Server DDL as a schema reference if you want a head start on table definitions. SQLAlchemy + pandas makes the text → PostgreSQL pipeline very clean and very Jupyter-friendly.

Do you have a sense yet of which O*NET tables you're planning to use? That affects how much schema work you'd actually need to do.
```

With this response, I'm thinking that I will download the SQL Server and Text versions.

I'm not certain how much I should rely on AI at this stage. I want to learn, and I also don't want to waste time spinning my wheels. 

I downloaded the SQL Server and Text versions. 

I like that the sql server version has the schema already laid out. I'd prefer not to have to create it from scratch, or even wind up going the wrong way. I want those table relationships ready to go.

Question to Claude:

```
Thank you. I downloaded and extracted both the sql server and text versions.

I think the sqlserver version may wind up saving me time setting up the schema.

Is there any type of automated file format converter?
```

Response:

```
Yes, **pgloader** is the standard tool for this and handles MySQL-to-PostgreSQL conversions well, but for SQL Server DDL files (which is what you have — just schema scripts, not a live database), it's actually overkill.

For SQL Server DDL → PostgreSQL, your realistic options are:

**Automated/semi-automated:**
- **sqlfluff** — SQL linter/rewriter that can reformat across dialects, though it's more for style than full conversion
- **AWS Schema Conversion Tool (SCT)** — surprisingly good at SQL Server → PostgreSQL, and it's free. Overkill for O*NET's relatively simple schema, but it works
- **db-convert.com / SQLines** — online converters that handle DDL translation; SQLines has a free command-line tool

**Honestly, for O*NET's schema, manual is probably faster.** The substitutions are repetitive and mechanical:

INT IDENTITY(1,1)  →  SERIAL
NVARCHAR(n)        →  VARCHAR(n)
DATETIME           →  TIMESTAMP
[bracket quoting]  →  "double quote" or just remove
GO                 →  ; (or remove)

O*NET's tables aren't deeply complex — if you open the SQL Server file and it's a few dozen CREATE TABLE statements, a find-and-replace pass in VS Code would probably take you 10 minutes and give you cleaner output than any converter.

Want me to take a look at the DDL structure if you paste a sample? I can tell you quickly whether automation is worth it or if manual cleanup is the faster path.
```

I think we're going to try to let Claude handle the conversion. I'll upload each file and we'll write a replacement script that can be run in Vim to handle any changes, then check the final result in PostgreSQL and PgAdmin4.

# Converting and Importing Files Into PostgreSQL

I ask Claude if we should proceed through the files in numerical order.

```
Numerical order makes sense for one reason: the early files (01–10) look like reference/lookup tables, and the later files depend on them via foreign keys. Loading in order respects that dependency chain and avoids constraint errors.

That said, before we dive in — what's your goal here? A few options:

1. **Convert all 40 files** to PostgreSQL DDL, then load everything
2. **Convert only the tables you need** for your capstone analysis and skip the rest
3. **Inspect a few files first** to assess how much conversion work is actually involved

For a capstone focused on training requirements, work styles, and wages cross-referenced with income, you likely only need a subset — probably something like:

- 03_occupation_data (the spine)
- 11_abilities, 12_education_training_experience, 16_skills (training investment side)
- 21_work_styles, 22_work_values (work style side)
- 14_job_zones (proxy for training level)
- 02_job_zone_reference, 04_scales_reference (reference tables those depend on)

Plus whatever BLS wage tables you're joining on the other side.

Loading all 40 is doable but adds setup time for tables you may never query. Would you like to scope it down first, or do you want the full schema available for exploratory flexibility?
```

I don't really know what's relevant at this stage. 

My bigger concern is that, were I to start with skipping tables, I may find myself lost later and not know why. I could end up losing more time that way. 

The route I choose at this stage is to be thorough until I am able to discern relevancy. With familiarity, I might be able to start skipping files. 

Let's start at the beginning, `01...`, and work forwards.

## Small Aside in My Diary

Fairbanks weather is warming up. The chimney in my house is destroyed and I have it wrapped up with a black garbage bag so that the air doesn't go up the chute. With the air warming up, the ice collected inside the chute is melting. This makes for drips of water dripping down onto my black garbage bag as I work. 'Plat. Plat. Plat.' The sound echoes the clattering of my keyboard.

A large piece of ice or something inside the chute just broke off and pummeled into the black garbage bag, leaving a stretched imprint where the sharp point almost broke through the black plastic.

# Creating a Script for Conversion

Claude wrote an initial draft of the script, found in this file here:

```
./raw-data/scripts/2026-03-29-00-mysql-to-postgres.py
```

# Delay

My OS is OpenMandriva ROME. There were some breaking changes in a recent update. Fixing it was a challenge. Claude helped me through it.

# Running the script

Everything ran fine.

I suggested to Claude that we keep both BLS and ONET in the same database, with different schema names, to keep the joining process easier.

---

The conversion process didn't show any errors.

Imported the `01...` file and the result showed `630` rows, so we're getting some kind of result.

We imported the first 10 with a for loop.

```
for f in 02_job_zone_reference.sql \
          03_occupation_data.sql \
          04_scales_reference.sql \
          05_ete_categories.sql \
          06_level_scale_anchors.sql \
          07_occupation_level_metadata.sql \
          08_survey_booklet_locations.sql \
          09_task_categories.sql \
          10_work_context_categories.sql; do
    echo "Importing $f..."
    sudo -u postgres /usr/local/pgsql/bin/psql -d train_reward_compare -f "$f"
    echo "Done: $f"
done
```

Checking now for row counts.

```
sudo -u postgres /usr/local/pgsql/bin/psql -d train_reward_compare -c "
SELECT schemaname, relname AS tablename, n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'onet'
ORDER BY relname;"
```

```
 schemaname |         tablename         | row_count
------------+---------------------------+-----------
 onet       | content_model_reference   |       630
 onet       | ete_categories            |        41
 onet       | job_zone_reference        |         4
 onet       | level_scale_anchors       |       483
 onet       | occupation_data           |      1016
 onet       | occupation_level_metadata |     32202
 onet       | scales_reference          |        31
 onet       | survey_booklet_locations  |       211
 onet       | task_categories           |         7
 onet       | work_context_categories   |       281
(10 rows)
```

Revised loop script suppresses `INSERT ... ` output.

```
for f in 11_abilities.sql \
          12_education_training_experience.sql \
          13_interests.sql \
          14_job_zones.sql \
          15_knowledge.sql \
          16_skills.sql \
          17_task_statements.sql \
          18_task_ratings.sql \
          19_work_activities.sql \
          20_work_context.sql; do
    echo "Importing $f..."
    sudo -u postgres /usr/local/pgsql/bin/psql -d train_reward_compare -f "$f" 2>&1 | grep -v "^INSERT" | grep -v "^$"
    echo "Done: $f"
done
```

---

Everything seems to be importing fine.

In PgAdmin4, I'm occasionally running this and observing as row counts increase.

```
SELECT schemaname, relname AS tablename, n_live_tup AS row_count
    FROM pg_stat_user_tables
    WHERE schemaname = 'onet'
    ORDER BY relname;
```

While I wait for this to process, it's time to start downloading and importing the BLS Wage dataset.

## BLS Wage Dataset

I'm downloading and importing these:

```
- oesm24nat.zip — National
- oesm24st.zip — State
- oesm24ma.zip — Metropolitan and nonmetropolitan area
- oesm24in4.zip — National industry-specific and by ownership
- oesm24all.zip — All data
```

## Perms Fix

They all came with mixed up permissions.

```
(base) .../raw-data/bls-wage $ ls -la
total 28
drwxrwxr-x 7 bluesanta bluesanta 4096 Mar 29 15:30 .
drwxrwxr-x 7 bluesanta bluesanta 4096 Mar 29 15:28 ..
dr-xr-xr-x 2 bluesanta bluesanta 4096 Feb 24 12:36 oesm24all
drwxrwxrwx 2 bluesanta bluesanta 4096 Mar 11  2025 oesm24in4
dr-xr-xr-x 2 bluesanta bluesanta 4096 Feb 24 12:25 oesm24ma
drwxrwxrwx 2 bluesanta bluesanta 4096 Mar 11  2025 oesm24nat
dr-xr-xr-x 2 bluesanta bluesanta 4096 Jun  6  2025 oesm24st
(base) .../raw-data/bls-wage $ chmod 755 oesm24all oesm24in4 oesm24ma oesm24nat oesm24st
(base) .../raw-data/bls-wage $ ls
oesm24all  oesm24in4  oesm24ma  oesm24nat  oesm24st
(base) .../raw-data/bls-wage $
```

## Opening Up a File

I opened up the `oesma24nat` file and I can see that it is properly downloaded. There's lots of interesting information.

The question now is, how do I transfer this into the `bls` schema in the `train_reward_compare` db.

Is there a `.xlsx` import tool for postgresql? I know there's one for pandas, but I'm trying to start with postgresql.

## Importing BLS Wage Data

According to Claude, the best way to do this is to simply go through Pandas and SQLAlchemy. Not a problem. 

### Advice from Claude

I'm still using Claude at this point. There's too much data for me to sort through all at once and I don't want to waste time getting lost in the weeds when I'm on a timeline. 

Claude recommended running a simple script to look at the first five rows of the national data file before proceeding.

After taking a peek, here's what Claude advised. 

```
Good structure. A few things worth noting:

Useful columns for your capstone:
- OCC_CODE — joins to O*NET's onetsoc_code (with some formatting cleanup needed)
- OCC_TITLE — occupation name
- TOT_EMP — total employment
- A_MEAN, A_MEDIAN — annual mean and median wage
- A_PCT10 through A_PCT90 — wage distribution percentiles
- AREA, AREA_TITLE, PRIM_STATE — geography (relevant for state comparison)

Things to handle on import:
- The # values you see in A_PCT90 — BLS uses # to mean "wage exceeds $239,200" (the top-coded ceiling). You'll need to decide whether to treat these as NaN or as a known floor value
- ANNUAL and HOURLY columns are flags indicating whether the occupation reports annual or hourly wages, not wage values — don't confuse them for numbers
- NAICS and NAICS_TITLE are present in this file too, meaning it has some industry breakdown baked in — worth checking if this is the same data as oesm24in4 or a subset

Check how many rows total:

    python -c "import pandas as pd; df = pd.read_excel('national_M2024_dl.xlsx'); print(len(df), 'rows')"

That'll tell us how large the full import will be.
```
