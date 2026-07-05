# ForgeMind API Specification

## Base URL

```
/api/v1
```

---

# Health

## GET /health

Checks if the backend is running.

Response

```json
{
  "status": "healthy"
}
```

---

# Company

## GET /company/{company}

Returns basic company information.

Response

```json
{
  "name": "NVIDIA",
  "industry": "Semiconductors",
  "headquarters": "Santa Clara, California",
  "ceo": "Jensen Huang",
  "founded": 1993
}
```

---

## GET /company/{company}/overview

Returns executive overview.

Fields

- Description
- Industry
- Headquarters
- CEO
- Founded
- Employees
- Market Cap

---

## GET /company/{company}/financials

Returns financial metrics.

Fields

- Revenue
- Net Income
- Operating Margin
- EPS
- Market Cap

---

## GET /company/{company}/competitors

Returns major competitors.

Example

- AMD
- Intel
- Qualcomm

---

## GET /company/{company}/news

Returns latest news articles.

Fields

- Title
- Source
- Published Date
- URL
- Summary

---

## GET /company/{company}/sentiment

Returns sentiment analysis.

Response

```json
{
  "positive": 72,
  "neutral": 18,
  "negative": 10
}
```

---

## GET /company/{company}/forecast

Returns ML forecast.

Response

```json
{
  "trend": "Growth",
  "confidence": 0.91
}
```

---

# AI

## POST /ai/executive-summary

Input

```json
{
  "company": "NVIDIA"
}
```

Output

- Executive Summary
- SWOT
- Opportunities
- Risks

---

## POST /ai/report

Generates a board-ready report.

Formats

- PDF
- Markdown

---

# Authentication

## POST /auth/signup

## POST /auth/login

## GET /auth/profile

---

# Reports

## GET /reports

Returns previously generated reports.

---

# Favorites

## POST /favorites

Save a company.

## DELETE /favorites/{id}

Remove a favorite company.