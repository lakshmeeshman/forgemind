"""
tests/test_company.py
------------------------
Tests for the /company/{ticker} endpoint.

Why this file exists:
    Mirrors the existing tests/test_health.py pattern: proves the full
    wiring (main.py -> api/v1/router.py -> api/v1/company.py ->
    services/company_service.py -> schemas/company.py) works together.

Status (Sprint 7 - Live Market Data Integration):
    The service layer now calls out to Yahoo Finance via `yfinance`.
    To keep this test suite fast, deterministic, and runnable without
    network access (or being subject to Yahoo Finance rate limits /
    outages), these tests monkeypatch `yfinance.Ticker` at the service
    boundary rather than hitting the real API. This tests our own
    mapping/validation/error-handling logic, which is what these tests
    are responsible for — not Yahoo Finance's availability.

Run with:
    pytest
"""

from fastapi.testclient import TestClient

from main import app
from services import company_service

client = TestClient(app)


class _FakeYFTicker:
    """Stand-in for yfinance.Ticker used to control `.info` in tests."""

    def __init__(self, info: dict):
        self.info = info

    @classmethod
    def raising(cls, exc: Exception):
        """Build a fake ticker whose `.info` property raises `exc`."""
        instance = cls.__new__(cls)

        def _raise_info(self):
            raise exc

        # `.info` is a property on the real yfinance.Ticker, so we
        # patch it at the class/instance level to also behave as one.
        instance.__class__ = type(
            "_RaisingFakeYFTicker",
            (cls,),
            {"info": property(_raise_info)},
        )
        return instance


def test_get_company_returns_200_for_known_ticker(monkeypatch):
    fake_info = {
        "longName": "Apple Inc.",
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "marketCap": 3123000000000,
        "currentPrice": 241.15,
        "currency": "USD",
    }
    monkeypatch.setattr(
        company_service.yf, "Ticker", lambda ticker: _FakeYFTicker(fake_info)
    )

    response = client.get("/api/v1/company/AAPL")
    assert response.status_code == 200


def test_get_company_response_shape(monkeypatch):
    fake_info = {
        "longName": "Apple Inc.",
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "marketCap": 3123000000000,
        "currentPrice": 241.15,
        "currency": "USD",
    }
    monkeypatch.setattr(
        company_service.yf, "Ticker", lambda ticker: _FakeYFTicker(fake_info)
    )

    response = client.get("/api/v1/company/AAPL")
    body = response.json()

    assert body["ticker"] == "AAPL"
    assert body["name"] == "Apple Inc."
    assert body["sector"] == "Technology"
    assert body["industry"] == "Consumer Electronics"
    assert body["market_cap"] == 3123000000000
    assert body["current_price"] == 241.15
    assert body["currency"] == "USD"


def test_get_company_is_case_insensitive(monkeypatch):
    fake_info = {
        "longName": "Microsoft Corporation",
        "sector": "Technology",
        "industry": "Software - Infrastructure",
        "marketCap": 3180000000000,
        "currentPrice": 427.80,
        "currency": "USD",
    }
    monkeypatch.setattr(
        company_service.yf, "Ticker", lambda ticker: _FakeYFTicker(fake_info)
    )

    response = client.get("/api/v1/company/msft")
    assert response.status_code == 200
    assert response.json()["ticker"] == "MSFT"


def test_get_company_falls_back_to_regular_market_price(monkeypatch):
    """Some securities lack `currentPrice` but expose `regularMarketPrice`."""
    fake_info = {
        "shortName": "Example Corp",
        "sector": "Industrials",
        "industry": "Conglomerates",
        "marketCap": 1000000000,
        "regularMarketPrice": 55.25,
        "currency": "USD",
    }
    monkeypatch.setattr(
        company_service.yf, "Ticker", lambda ticker: _FakeYFTicker(fake_info)
    )

    response = client.get("/api/v1/company/EXMPL")
    assert response.status_code == 200
    assert response.json()["current_price"] == 55.25


def test_get_company_returns_404_for_unknown_ticker(monkeypatch):
    """
    yfinance does not raise for invalid tickers — it returns a sparse
    `.info` dict. Our service layer must detect that and treat it as
    "not found".
    """
    sparse_info = {"trailingPegRatio": None}
    monkeypatch.setattr(
        company_service.yf, "Ticker", lambda ticker: _FakeYFTicker(sparse_info)
    )

    response = client.get("/api/v1/company/UNKNOWN")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_company_returns_503_when_provider_unavailable(monkeypatch):
    """A network/provider failure should surface as 503, not 404 or 500."""
    monkeypatch.setattr(
        company_service.yf,
        "Ticker",
        lambda ticker: _FakeYFTicker.raising(ConnectionError("network unreachable")),
    )

    response = client.get("/api/v1/company/AAPL")
    assert response.status_code == 503
    assert "unavailable" in response.json()["detail"].lower()
