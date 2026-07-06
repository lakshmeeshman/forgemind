"""
tests/test_company_intelligence.py
-------------------------------------
Tests for the Sprint 8/9 company intelligence endpoints:
  GET /company/{ticker}/overview
  GET /company/{ticker}/products
  GET /company/{ticker}/financials
  GET /company/{ticker}/competitors
  GET /company/{ticker}/news
  GET /company/{ticker}/sentiment
  GET /company/{ticker}/forecast

Status (Sprint 9 - Intelligence Placeholder Behavior):
    Every intelligence function now validates the ticker via the live
    Yahoo Finance lookup (services.company_service.get_company_by_ticker)
    before returning curated or placeholder content. That means these
    tests must mock the yfinance boundary the same way
    tests/test_company.py does for the profile endpoint — otherwise
    they'd depend on real network access to Yahoo Finance.

    Three scenarios are covered per endpoint where relevant:
      1. A valid ticker WITH curated mock content -> curated response.
      2. A valid ticker WITHOUT curated mock content -> empty/placeholder
         response (200, not 404).
      3. An invalid ticker -> 404.

Run with:
    pytest
"""

from fastapi.testclient import TestClient

from main import app
from services import company_service

client = TestClient(app)

CURATED_TICKER = "AAPL"
UNCURATED_TICKER = "EXMPL"  # a "real" company with no curated intelligence content
INVALID_TICKER = "ZZZZ"

CURATED_INFO = {
    "longName": "Apple Inc.",
    "sector": "Technology",
    "industry": "Consumer Electronics",
    "marketCap": 3123000000000,
    "currentPrice": 241.15,
    "currency": "USD",
}

UNCURATED_INFO = {
    "longName": "Example Corp",
    "sector": "Industrials",
    "industry": "Conglomerates",
    "marketCap": 1000000000,
    "currentPrice": 55.25,
    "currency": "USD",
}

INVALID_INFO = {"trailingPegRatio": None}  # yfinance's shape for an unknown ticker


class _FakeYFTicker:
    def __init__(self, info: dict):
        self.info = info


def _mock_ticker_info(monkeypatch, ticker_to_info: dict):
    """Mocks yf.Ticker so different tickers resolve to different fake info."""
    monkeypatch.setattr(
        company_service.yf,
        "Ticker",
        lambda ticker: _FakeYFTicker(ticker_to_info.get(ticker.upper(), INVALID_INFO)),
    )


def _mock_all_as(monkeypatch, info: dict):
    """Mocks yf.Ticker so EVERY ticker resolves to the same fake info."""
    monkeypatch.setattr(company_service.yf, "Ticker", lambda ticker: _FakeYFTicker(info))


# ----------------------------------------------------------------------
# Overview
# ----------------------------------------------------------------------

def test_overview_returns_curated_content_for_curated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/overview")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == CURATED_TICKER
    assert len(body["strengths"]) > 0


def test_overview_returns_empty_placeholder_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/overview")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == UNCURATED_TICKER
    assert body["strengths"] == []
    assert body["weaknesses"] == []
    assert body["opportunities"] == []
    assert body["threats"] == []
    assert "not yet available" in body["summary"].lower()


def test_overview_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/overview")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# Products
# ----------------------------------------------------------------------

def test_products_returns_curated_content_for_curated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/products")
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 0
    assert "name" in body[0] and "market_share" in body[0]


def test_products_returns_empty_list_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/products")
    assert response.status_code == 200
    assert response.json() == []


def test_products_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/products")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# Financials
# ----------------------------------------------------------------------

def test_financials_returns_curated_content_for_curated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/financials")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == CURATED_TICKER
    assert len(body["years"]) == len(body["income_statement"][0]["values"])


def test_financials_returns_empty_placeholder_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/financials")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == UNCURATED_TICKER
    assert body["years"] == []
    assert body["income_statement"] == []
    assert body["balance_sheet"] == []
    assert body["cash_flow"] == []


def test_financials_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/financials")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# Competitors
# ----------------------------------------------------------------------

def test_competitors_returns_curated_content_with_target_flagged(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/competitors")
    assert response.status_code == 200
    body = response.json()
    assert any(row["is_target_company"] for row in body)


def test_competitors_returns_empty_list_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/competitors")
    assert response.status_code == 200
    assert response.json() == []


def test_competitors_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/competitors")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# News
# ----------------------------------------------------------------------

def test_news_returns_curated_content_for_curated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/news")
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 0
    assert body[0]["sentiment"] in ("positive", "neutral", "negative")


def test_news_returns_empty_list_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/news")
    assert response.status_code == 200
    assert response.json() == []


def test_news_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/news")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# Sentiment
# ----------------------------------------------------------------------

def test_sentiment_returns_curated_content_for_curated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/sentiment")
    assert response.status_code == 200
    body = response.json()
    assert body["positive"] + body["neutral"] + body["negative"] == 100


def test_sentiment_returns_empty_placeholder_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/sentiment")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == UNCURATED_TICKER
    assert body["positive"] == 0
    assert body["neutral"] == 0
    assert body["negative"] == 0
    assert body["social_sentiment"]["score"] == 0
    assert body["social_sentiment"]["label"] == "No data available"


def test_sentiment_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/sentiment")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# Forecast
# ----------------------------------------------------------------------

def test_forecast_returns_curated_content_for_curated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/company/{CURATED_TICKER}/forecast")
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 0
    assert "revenue" in body[0] and "scenario" in body[0]


def test_forecast_returns_empty_list_for_valid_uncurated_ticker(monkeypatch):
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/company/{UNCURATED_TICKER}/forecast")
    assert response.status_code == 200
    assert response.json() == []


def test_forecast_returns_404_for_invalid_ticker(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/company/{INVALID_TICKER}/forecast")
    assert response.status_code == 404


# ----------------------------------------------------------------------
# Report summary (aggregates live profile + intelligence overview)
# ----------------------------------------------------------------------

def test_report_summary_returns_200_with_curated_overview(monkeypatch):
    _mock_all_as(monkeypatch, CURATED_INFO)
    response = client.get(f"/api/v1/reports/summary/{CURATED_TICKER}")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == CURATED_TICKER
    assert body["company_name"] == "Apple Inc."
    assert len(body["key_strengths"]) > 0
    assert len(body["key_risks"]) > 0
    assert "generated_at" in body


def test_report_summary_uses_empty_placeholder_for_valid_uncurated_ticker(monkeypatch):
    """
    A ticker with NO curated Sprint 8 intelligence overview should still
    produce a report — get_company_overview() now returns an empty
    placeholder (Sprint 9) rather than raising, so the report's
    executive_summary reflects that placeholder text directly.
    """
    _mock_all_as(monkeypatch, UNCURATED_INFO)
    response = client.get(f"/api/v1/reports/summary/{UNCURATED_TICKER}")
    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == UNCURATED_TICKER
    assert "not yet available" in body["executive_summary"].lower()
    assert body["key_strengths"] == []
    assert body["key_risks"] == []


def test_report_summary_returns_404_when_ticker_invalid(monkeypatch):
    _mock_all_as(monkeypatch, INVALID_INFO)
    response = client.get(f"/api/v1/reports/summary/{INVALID_TICKER}")
    assert response.status_code == 404
