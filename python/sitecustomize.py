"""Compatibility helpers for InvokeAI runtime.

This module is automatically imported by Python when present on ``sys.path``.
It ensures that ``typing.Self`` is available when running on Python versions
prior to 3.11, where the attribute is not part of the standard library yet.
"""
from __future__ import annotations

import typing

if not hasattr(typing, "Self"):
    try:
        from typing_extensions import Self as _Self  # type: ignore
    except Exception:  # pragma: no cover - extremely narrow fallback
        _Self = typing.TypeVar("Self")

    typing.Self = _Self  # type: ignore[attr-defined]
