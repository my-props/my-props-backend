# Materialized Views Setup Instructions

## ⚠️ Important: Use ALT+X to Execute Scripts

In DBeaver, always use **ALT+X (Execute as Script)** instead of CTRL+ENTER when running these SQL scripts.

## 📁 Files

- `materialized_views.sql` - Creates the 4 materialized views
- `indexes_for_views.sql` - Creates performance indexes
- `refresh_procedures.sql` - Creates refresh procedures

## 🚀 Setup Order

1. **Views**: Execute `materialized_views.sql` (ALT+X)
2. **Indexes**: Execute `indexes_for_views.sql` (ALT+X)
3. **Procedures**: Execute `refresh_procedures.sql` (ALT+X)

## 🧪 Test

```sql
EXEC RefreshAllMaterializedViews
```

## 📊 Available Views

- PlayerVsTeamStats
- PlayerPositionStats  
- PlayerVsPositionStats
- PlayerVsPlayerStats
