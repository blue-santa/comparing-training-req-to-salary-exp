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

Going into `psql` mode to run these files. I'll place them in `/tmp` so that `postgres` can access them as they're generated.


