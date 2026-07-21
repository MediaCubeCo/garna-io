import json
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST

from .services import deel

with open(settings.BASE_DIR / "countries.json", encoding="utf-8") as _f:
    COUNTRIES: list = json.load(_f)

COUNTRIES_BY_CODE: dict = {c["value"]: c for c in COUNTRIES}


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "calc/index.html", {"countries": COUNTRIES})


@require_GET
def states(request: HttpRequest) -> HttpResponse:
    code = request.GET.get("country", "")
    country = COUNTRIES_BY_CODE.get(code, {})
    return render(request, "calc/partials/states.html", {
        "states": country.get("states", []),
        "local_currency": country.get("currency"),
        "local_currency_name": country.get("currencyName"),
    })


@require_POST
def calculate(request: HttpRequest) -> HttpResponse:
    country_code = request.POST.get("country", "")
    salary = int(request.POST.get("salary") or 0)
    period = request.POST.get("period", "monthly")
    state = request.POST.get("state") or None
    currency = request.POST.get("currency", "USD")
    result = deel.calculate(country_code, salary, currency, period, state)
    return render(request, "calc/partials/results.html", {"result": result})
