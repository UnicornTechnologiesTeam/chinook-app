def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_tracks_empty(client):
    response = client.get("/tracks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_track_not_found(client):
    response = client.get("/tracks/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_search_tracks_no_query(client):
    response = client.get("/tracks/?skip=0&limit=5")
    assert response.status_code == 200