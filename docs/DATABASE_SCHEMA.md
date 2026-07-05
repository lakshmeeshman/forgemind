# ForgeMind Database Schema

## Users

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| email | TEXT |
| password_hash | TEXT |
| created_at | TIMESTAMP |

---

## Companies

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| ticker | TEXT |
| industry | TEXT |
| headquarters | TEXT |
| ceo | TEXT |
| founded | INTEGER |
| description | TEXT |

---

## Search History

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| company_id | UUID |
| searched_at | TIMESTAMP |

---

## Favorites

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| company_id | UUID |

---

## Reports

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID |
| company_id | UUID |
| report_type | TEXT |
| created_at | TIMESTAMP |

---

## Cached Company Data

| Column | Type |
|---------|------|
| id | UUID |
| company_id | UUID |
| source | TEXT |
| payload | JSONB |
| updated_at | TIMESTAMP |

---

## Forecast Results

| Column | Type |
|---------|------|
| id | UUID |
| company_id | UUID |
| prediction | JSONB |
| confidence | FLOAT |
| generated_at | TIMESTAMP |