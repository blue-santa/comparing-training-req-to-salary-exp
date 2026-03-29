#!/usr/bin/env python3
"""
mssql_to_postgres.py
--------------------
Converts O*NET MSSQL .sql files to PostgreSQL-compatible .sql files.

Usage:
    # Convert a single file:
    python mssql_to_postgres.py 01_content_model_reference.sql

    # Convert all .sql files in a directory:
    python mssql_to_postgres.py --all ./db_30_2_mssql --outdir ./db_postgres

    # Convert all with schema prefix (recommended):
    python mssql_to_postgres.py --all ./db_30_2_mssql --outdir ./db_postgres --schema onet

    # Convert all, dry-run (print to stdout instead of writing files):
    python mssql_to_postgres.py --all ./db_30_2_mssql --dry-run --schema onet
"""

import re
import argparse
from pathlib import Path


# ---------------------------------------------------------------------------
# Conversion rules
# ---------------------------------------------------------------------------

def convert_mssql_to_postgres(sql: str, schema: str = None) -> str:
    """Apply all conversion rules to a MSSQL SQL string."""

    # 1. Remove GO statements (MSSQL batch separator, not valid in PostgreSQL)
    sql = re.sub(r'^\s*GO\s*$', '', sql, flags=re.MULTILINE | re.IGNORECASE)

    # 2. INT IDENTITY / BIGINT IDENTITY → SERIAL / BIGSERIAL
    sql = re.sub(r'\bBIGINT\s+IDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)', 'BIGSERIAL', sql, flags=re.IGNORECASE)
    sql = re.sub(r'\bINT\s+IDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)', 'SERIAL', sql, flags=re.IGNORECASE)
    sql = re.sub(r'\bINTEGER\s+IDENTITY\s*\(\s*\d+\s*,\s*\d+\s*\)', 'SERIAL', sql, flags=re.IGNORECASE)

    # 3. NVARCHAR / NCHAR / NTEXT → VARCHAR / CHAR / TEXT
    sql = re.sub(r'\bNVARCHAR\b', 'VARCHAR', sql, flags=re.IGNORECASE)
    sql = re.sub(r'\bNCHAR\b', 'CHAR', sql, flags=re.IGNORECASE)
    sql = re.sub(r'\bNTEXT\b', 'TEXT', sql, flags=re.IGNORECASE)

    # 4. DATETIME / SMALLDATETIME → TIMESTAMP
    sql = re.sub(r'\bSMALLDATETIME\b', 'TIMESTAMP', sql, flags=re.IGNORECASE)
    sql = re.sub(r'\bDATETIME\b', 'TIMESTAMP', sql, flags=re.IGNORECASE)

    # 5. BIT → BOOLEAN
    sql = re.sub(r'\bBIT\b', 'BOOLEAN', sql, flags=re.IGNORECASE)

    # 6. TINYINT → SMALLINT (PostgreSQL has no TINYINT)
    sql = re.sub(r'\bTINYINT\b', 'SMALLINT', sql, flags=re.IGNORECASE)

    # 7. [bracket identifiers] → "double-quoted identifiers"
    #    Only applies to bracket-wrapped words; avoids touching data values
    sql = re.sub(r'\[([^\]]+)\]', r'"\1"', sql)

    # 8. Collapse multiple blank lines left by GO removal into a single blank line
    sql = re.sub(r'\n{3,}', '\n\n', sql)

    sql = sql.strip() + '\n'

    # 9. Prepend SET search_path if a schema was specified
    if schema:
        header = f'SET search_path TO {schema};\n\n'
        sql = header + sql

    return sql


# ---------------------------------------------------------------------------
# File I/O helpers
# ---------------------------------------------------------------------------

def convert_file(inpath: Path, outpath: Path, schema: str = None, dry_run: bool = False) -> None:
    original = inpath.read_text(encoding='utf-8')
    converted = convert_mssql_to_postgres(original, schema=schema)

    if dry_run:
        print(f"--- DRY RUN: {inpath.name} ---")
        print(converted)
        print()
    else:
        outpath.parent.mkdir(parents=True, exist_ok=True)
        outpath.write_text(converted, encoding='utf-8')
        print(f"Converted: {inpath.name}  →  {outpath}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='Convert O*NET MSSQL files to PostgreSQL.')
    parser.add_argument('input', help='Input .sql file, or input directory when --all is set')
    parser.add_argument('--all', action='store_true', help='Convert all .sql files in the input directory')
    parser.add_argument('--outdir', default='./db_postgres', help='Output directory (default: ./db_postgres)')
    parser.add_argument('--schema', default=None, help='Prepend SET search_path TO <schema>; to each file (e.g. --schema onet)')
    parser.add_argument('--dry-run', action='store_true', help='Print output to stdout without writing files')
    args = parser.parse_args()

    inpath = Path(args.input)
    outdir = Path(args.outdir)

    if args.all:
        if not inpath.is_dir():
            print(f"Error: {inpath} is not a directory.")
            return
        sql_files = sorted(inpath.glob('*.sql'))
        if not sql_files:
            print(f"No .sql files found in {inpath}")
            return
        for f in sql_files:
            outpath = outdir / f.name
            convert_file(f, outpath, schema=args.schema, dry_run=args.dry_run)
        if not args.dry_run:
            print(f"\nDone. {len(sql_files)} files written to {outdir}/")
    else:
        if not inpath.is_file():
            print(f"Error: {inpath} is not a file.")
            return
        outpath = outdir / inpath.name if not args.dry_run else inpath
        convert_file(inpath, outpath, schema=args.schema, dry_run=args.dry_run)


if __name__ == '__main__':
    main()
