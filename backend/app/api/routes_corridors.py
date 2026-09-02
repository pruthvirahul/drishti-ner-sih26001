"""
Highway Lifeline Corridors & Road Connectivity API Endpoints
"""
import json
import os
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.models.schemas import HighwaySegment

router = APIRouter(prefix="/corridors", tags=["Highway Corridors"])

def load_corridors() -> List[dict]:
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "highway_corridors.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=List[HighwaySegment])
def get_all_corridors(status: Optional[str] = None):
    data = load_corridors()
    results = []
    for item in data:
        seg = HighwaySegment(**item)
        if status and seg.status.lower() != status.lower():
            continue
        results.append(seg)
    return results

@router.get("/{corridor_id}", response_model=HighwaySegment)
def get_corridor_by_id(corridor_id: str):
    data = load_corridors()
    for item in data:
        if item["id"].lower() == corridor_id.lower() or item["highway_number"].lower() == corridor_id.lower():
            return HighwaySegment(**item)
    raise HTTPException(status_code=404, detail=f"Corridor {corridor_id} not found")
