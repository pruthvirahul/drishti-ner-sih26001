import random
from typing import List
from datetime import datetime, timezone
from app.models.schemas_v2 import EvidenceRecord

# Simulated news DB for demo purposes
_mock_news_db = [
    EvidenceRecord(
        id="EVID-001",
        headline="NH-10 blocked at Melli due to heavy overnight landslide",
        date_published="2026-08-25T08:30:00Z",
        source="Sikkim Express / Local News",
        url="https://sikkimexpress.com/archive/nh10-blocked-melli",
        affected_infrastructure=["NH-10", "Teesta River Bank"],
        is_official=False
    ),
    EvidenceRecord(
        id="EVID-002",
        headline="IMD declares Orange Alert for East Jaintia Hills",
        date_published="2026-09-10T14:00:00Z",
        source="India Meteorological Department (IMD)",
        url="https://mausam.imd.gov.in/shillong/",
        affected_infrastructure=["Sonapur Tunnel", "NH-6"],
        is_official=True
    ),
    EvidenceRecord(
        id="EVID-003",
        headline="BRO clears single lane on NH-29 after Dzüdza mudslide",
        date_published="2026-09-02T11:15:00Z",
        source="Nagaland Post",
        url="https://nagalandpost.com/bro-clears-nh29",
        affected_infrastructure=["NH-29", "Dzüdza Bridge"],
        is_official=False
    ),
    EvidenceRecord(
        id="EVID-004",
        headline="NRSC NDEM releases landslide susceptibility map for NER monsoon",
        date_published="2026-06-01T10:00:00Z",
        source="ISRO NRSC / NDEM",
        url="https://ndem.nrsc.gov.in/landslide_ner",
        affected_infrastructure=["All NER Highways"],
        is_official=True
    )
]

class EvidenceService:
    def get_evidence_for_location(self, location_name: str, limit: int = 3) -> List[EvidenceRecord]:
        """
        Fetch external news and official evidence for a given location.
        In a real prod environment, this would hit Bing News API or Google Custom Search,
        and query IMD/NRSC RSS feeds.
        """
        # For demo, match on string presence
        results = [ev for ev in _mock_news_db if any(loc.lower() in location_name.lower() or loc.lower() in ev.headline.lower() for loc in ["Melli", "NH-10", "NH-6", "Sonapur", "Dzüdza", "NH-29"])]
        
        # Always return some official links
        official = [ev for ev in _mock_news_db if ev.is_official]
        
        combined = results + official
        # Remove duplicates
        seen = set()
        unique = []
        for ev in combined:
            if ev.id not in seen:
                seen.add(ev.id)
                unique.append(ev)
                
        return unique[:limit]

evidence_service = EvidenceService()
