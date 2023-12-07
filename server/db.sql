INSERT INTO zones (zone, parcel_area, parcel_width, density_or_intensity, living_area, garage_face, corner_vision_triangle, side_or_street_side, site_coverage, floor_area_ratio)
VALUES
    ('RLD', 
	 '{"name": "Parcel Area", "unit": "sqft", "min": 5000, "max": 2147483647}'::JSONB, 
	 '{"name": "Parcel Width", "unit": "ft", "min": 50, "max": 2147483647}'::JSONB, 
	 '{"name": "Density/Intensity", "unit": "du/acre", "min": 0, "max": 12}'::JSONB, 
	 '{"name": "Living Area", "min": 10, "unit": "ft", "max": 2147483647}'::JSONB, 
	 '{"name": "Garage Face", "min": 23, "unit": "ft", "max": 2147483647}'::JSONB, 
	 '{"name": "Corner Vision Triangle", "unit": "ft", "min": 12, "max": 2147483647}'::JSONB, 
	 '{"name": "Side/Street Side", "unit": "ft", "min": 5, "max": 2147483647}'::JSONB, 
	 '{"name": "Site Coverage", "unit": "%", "min": 50, "max": 2147483647}'::JSONB, 
	 '{"name": "Floor Area Ratio", "min": 0.55, "max": 2147483647}'::JSONB);

INSERT INTO attributeValues (zoneName, attributeName, minVal, maxVal)
VALUES
    ('RLD', 
	 'Floor Area Ratio', 
	 0.55, 
	 2147483647);

CREATE TABLE attributeValues (
	zoneName TEXT,
	attributeName TEXT,
	minVal DOUBLE PRECISION,
	maxVal DOUBLE PRECISION,
	unit TEXT
);

UPDATE zones
SET zone = 'rld',
    parcel_area = '{"min": 6000, "max": 8000}'::JSONB,
    parcel_width = '{"min": 60, "max": 80}'::JSONB

drop table zones

CREATE TABLE zones (
	zoneName TEXT,
	zoneNameConcat TEXT
);

SELECT * FROM attributeValues;

SELECT * FROM zones WHERE zone = 'RLD'

SELECT parcel_area->'min' FROM zones WHERE zone = 'RMD-2';