This is how the schema for our DB tables would look like

Zone table:
- zoneName (string)
- zoneId (int)

Attributes table:
- attributeName (string)
- attributeId (int)

AttributeValues table:
- attributeValue (int)
- zoneId (int)
- attributeId (int)
- minVal (int)
- maxVal (int)
- unit (string)
- FOREIGN KEY (ZoneID) REFERENCES Zones(ZoneID),
- FOREIGN KEY (AttributeID) REFERENCES Attributes(AttributeID)