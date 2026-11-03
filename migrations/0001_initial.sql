CREATE TABLE IF NOT EXISTS catalog (id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('vehicle','package')), title TEXT NOT NULL, description TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', price TEXT NOT NULL DEFAULT 'Quote on request', published INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, idempotency_key TEXT NOT NULL UNIQUE, kind TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, details TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'New', quote TEXT NOT NULL DEFAULT '', assigned_vehicle TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS enquiries_status_created ON enquiries(status,created_at DESC);
CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, actor TEXT NOT NULL, event TEXT NOT NULL, entity_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO catalog(id,kind,title,description,details) VALUES
('sedan','vehicle','Sedan','City errands, airport runs & a lighter getaway.','Up to 4 passengers · Ask about luggage'),
('suv','vehicle','SUV / MUV','A little more room for family & longer journeys.','6–7 seat options · Model to be confirmed'),
('van','vehicle','Van / Traveller','Family occasions, team outings & group travel.','Tell us your group size · Seating confirmed in quote'),
('mahabalipuram','package','Mahabalipuram','ECR drives, shore-side stops & time together.','Custom itinerary · Chennai pickup'),
('pondicherry','package','Pondicherry','A change of pace, a sea breeze, a longer lunch.','Day / overnight enquiry · Custom quote'),
('pilgrimage','package','Your pilgrimage','Tirupati, Kanchipuram or the route you have in mind.','Travel-only enquiry · Tickets not included');
