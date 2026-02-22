# Supabase migrations

SQL files in `migrations/` are meant to be run manually in the **Supabase SQL Editor** (Dashboard → SQL Editor → New query). Copy the contents of a migration file, paste into the editor, and Run.

- Run each file **once** per project. If you need to re-run, you may have to drop existing policies or tables first.
- Order: run `001_*` before `002_*`, etc.
