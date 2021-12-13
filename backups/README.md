# Backups

This folder is reserved to PostgreSQL production backups (dump files) that are generated via
`yarn db:backup`.

They can be automatically restored via `yarn db:restore YYYY-MM-DDThh-mm-ss.SSSZ` (ISO Date string).
