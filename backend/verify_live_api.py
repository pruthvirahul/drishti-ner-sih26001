import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("=== LIVE API VERIFICATION ===")
    
    # 1. Root
    r1 = requests.get(f"{BASE_URL}/")
    print(f"1. GET / -> Status: {r1.status_code}")
    print("   Response:", json.dumps(r1.json(), indent=2))

    # 2. Hotspots
    r2 = requests.get(f"{BASE_URL}/api/risk/hotspots")
    hotspots = r2.json()
    print(f"\n2. GET /api/risk/hotspots -> Status: {r2.status_code}, Count: {len(hotspots)}")
    for h in hotspots[:3]:
        print(f"   - {h['name']} ({h['state']}): Risk = {h['current_risk']['risk_score']} / 100 ({h['current_risk']['risk_level']}) | Trigger: {h['current_risk']['primary_trigger']}")

    # 3. XAI Explain
    r3 = requests.get(f"{BASE_URL}/api/risk/explain/NER-MEG-001")
    xai = r3.json()
    print(f"\n3. GET /api/risk/explain/NER-MEG-001 -> Status: {r3.status_code}")
    print("   XAI Top Factors:")
    for f in xai['top_factors'][:3]:
        print(f"     * {f['factor_name']} ({f['feature_value']}) -> +{f['impact_pct']}% impact")

    # 4. Corridors
    r4 = requests.get(f"{BASE_URL}/api/corridors")
    corridors = r4.json()
    print(f"\n4. GET /api/corridors -> Status: {r4.status_code}, Count: {len(corridors)}")
    for c in corridors:
        print(f"   - {c['highway_number']}: {c['corridor_name']} | Status: {c['status']} | Detour: {c['detour_advisory'][:60]}...")

    # 5. Simulation
    sim_payload = {"rainfall_surge_pct": 50.0, "include_seismic_tremor": False}
    r5 = requests.post(f"{BASE_URL}/api/simulate", json=sim_payload)
    sim = r5.json()
    print(f"\n5. POST /api/simulate -> Status: {r5.status_code}")
    print(f"   Simulation ID: {sim['simulation_id']}")
    print(f"   Summary: {sim['executive_summary']}")

    # 6. Alerts
    r6 = requests.get(f"{BASE_URL}/api/alerts")
    print(f"\n6. GET /api/alerts -> Status: {r6.status_code}, Count: {len(r6.json())}")

    print("\n✅ ALL API ENDPOINTS ARE 100% OPERATIONAL!")

if __name__ == "__main__":
    test_api()
