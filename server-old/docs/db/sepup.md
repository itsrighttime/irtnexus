### **Features Recap**

1. **Multiple Databases**

   * Uses `DATABASES_TABLE_FOLDERS` from config.
   * Each database can have its own set of migration folders.

2. **Hard & Soft Migrations**

   * `--hard`: Drops database, recreates it, executes all files.
   * `--soft`: Keeps existing database, executes only new files (tracked in `_migrations`).

3. **Migration Tracking**

   * `_migrations` table records executed files.
   * Prevents re-running already applied migrations.

4. **Automatic Backup**

   * Every migration (soft or hard) creates a timestamped SQL backup in `./backups/`.

5. **Safe Execution**

   * Stops on SQL errors.
   * Uses logging for clear feedback (`logger.info` and `logger.error`).

6. **User Management**

   * Drops users via `syncDropUsers` before hard migration.
   * Compatible with your existing database user system.

7. **Ordered Execution**

   * SQL files are read from folders and executed in sorted order for predictable schema setup.

8. **CLI Usage**

   ```bash
   node migrate.js --hard  # Full reset migration
   node migrate.js --soft  # Only new files
   ```

---

### **Best Practices for Developers**

* **Adding a new migration file:**

  * Place `.sql` file in the appropriate folder under `src/database/migrate/<folder>`.
  * Naming convention with a prefix (e.g., `001_create_table.sql`) ensures correct execution order.
  * Soft migration will automatically detect and execute new files only.

* **Backup and rollback:**

  * Every migration automatically creates a backup.
  * You can restore manually using:

    ```bash
    mysql -u <user> -p <db_name> < backups/<db_name>_<timestamp>.sql
    ```

* **Do not bypass the migration system:**

  * Directly executing SQL against production can break tracking.
  * Always use `_migrations` to ensure consistency.

* **Mode selection:**

  * Use `--hard` only for development or if you really want a clean reset.
  * Use `--soft` for incremental changes in production.

---

This setup is now **safe for production and flexible for development**, while enforcing a structured migration process.

If you want, I can also **update your developer documentation** to include **this migration system**, showing **how to integrate new databases, add migration files, and run hard/soft migrations safely**.

Do you want me to draft that full doc next?
