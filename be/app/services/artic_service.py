import os
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

ARTIC_BASE_URL = os.getenv("ARTIC_API_BASE_URL", "https://api.artic.edu/api/v1")

_cache: dict[int, dict] = {}


def _build_image_url(image_id: Optional[str]) -> Optional[str]:
    if not image_id:
        return None
    return f"https://www.artic.edu/iiif/2/{image_id}/full/400,/0/default.jpg"


async def get_artwork(external_id: int) -> Optional[dict]:
    if external_id in _cache:
        return _cache[external_id]

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                f"{ARTIC_BASE_URL}/artworks/{external_id}",
                params={"fields": "id,title,image_id"},
            )
            if response.status_code == 404:
                return None
            response.raise_for_status()
            data = response.json()["data"]
            result = {
                "id": data["id"],
                "title": data["title"],
                "image_url": _build_image_url(data.get("image_id")),
            }
            _cache[external_id] = result
            return result
        except Exception:
            return None
