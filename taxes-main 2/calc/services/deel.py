from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional
import httpx

_URL = "https://api-prod.letsdeel.com/guest/take_home_calculator/calculate"


@dataclass
class TaxCost:
    name: str
    value: float
    valueUSD: str
    valueExchanged: str

    @classmethod
    def from_dict(cls, d: dict) -> TaxCost:
        return cls(
            name=d["name"],
            value=d["value"],
            valueUSD=d["valueUSD"],
            valueExchanged=d["valueExchanged"],
        )


@dataclass
class TakeHomeResult:
    country: str
    currency: str
    originalCurrency: str
    exchangeRate: str
    disclaimer: Optional[str]
    netAnnualSalary: str
    grossAnnualSalary: str
    grossAnnualSalaryExchanged: str
    grossAnnualSalaryUSD: str
    netAnnualSalaryUSD: str
    netAnnualSalaryExchanged: str
    costs: List[TaxCost] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, d: dict) -> TakeHomeResult:
        return cls(
            country=d["country"],
            currency=d["currency"],
            originalCurrency=d["originalCurrency"],
            exchangeRate=d["exchangeRate"],
            disclaimer=d["disclaimer"],
            netAnnualSalary=d["netAnnualSalary"],
            grossAnnualSalary=d["grossAnnualSalary"],
            grossAnnualSalaryExchanged=d["grossAnnualSalaryExchanged"],
            grossAnnualSalaryUSD=d["grossAnnualSalaryUSD"],
            netAnnualSalaryUSD=d["netAnnualSalaryUSD"],
            netAnnualSalaryExchanged=d["netAnnualSalaryExchanged"],
            costs=[TaxCost.from_dict(c) for c in d.get("costs", [])],
            errors=d.get("errors", []),
        )


def calculate(
    country: str,
    salary: int,
    currency: str,
    period: str,
    state: Optional[str] = None,
) -> TakeHomeResult:
    body: dict = {"country": country, "salary": salary, "currency": currency, "period": period}
    if state:
        body["state"] = state
    r = httpx.post(_URL, json=body)
    return TakeHomeResult.from_dict(r.json())
