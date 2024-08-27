import sqlite3
db = sqlite3.connect("new_data.db")
db.execute("""
CREATE TABLE farmer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rating INTEGER,
    profile_image BLOB,
    latitude REAL,
    longitude REAL,
    location_text TEXT
)
""")
db.commit()
db.execute("""
INSERT INTO farmer (name, rating, latitude, longitude, location_text)
VALUES 
('John Doe', 4, 12.9716, 77.5946, 'Bangalore, India'),
('Jane Smith', 5, 40.7128, -74.0060, 'New York, USA'),
('Carlos Diaz', 3, 19.4326, -99.1332, 'Mexico City, Mexico'),
('Amina Yusuf', 4, -1.2921, 36.8219, 'Nairobi, Kenya'),
('Li Wei', 5, 39.9042, 116.4074, 'Beijing, China');
""")
db.commit()
