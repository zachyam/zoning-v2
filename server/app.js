const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./database')

app.use(express.json());
app.use(cors({
    origin: 'https://zoning-server.onrender.com/', // use your actual domain name (or localhost), using * is not recommended
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

app.get('/', (req, res, next) => {
    res.status(200).json({ success: 'Hello Server' });
});

app.get("/getZoneCompliance/:zoneNameConcat", async(req, res) => {
    const zoneNameConcat = req.params.zoneNameConcat;
    // Fetch all rows with matching zone name
    const zoneData = await pool.query('SELECT * FROM attributevalues WHERE zonename = $1', [zoneNameConcat]);
    return res.json(zoneData.rows);
})

app.post("/addZoneCompliance/:zoneNameConcat", async(req, res) => {
    const data = req.body.data;
    const zone = req.params.zoneNameConcat;
    const unit = data.unit;
    const newCodeRegulationName = data.newCodeRegulationName;
    const noMaximum = data.noMaximum;
    const noMinimum = data.noMinimum;
    let values = []
    if (zone == null || newCodeRegulationName == null) {
        return res.status(404).json({ error: "Zone or New Development Standard Name cannot be null" });
    }
    const newCodeRegulationMinVal = (data.newCodeRegulationMinVal == -1 || noMinimum) ? 0 : data.newCodeRegulationMinVal ;
    const newCodeRegulationMaxVal = (data.newCodeRegulationMaxVal == -1 || noMaximum) ? 2147483647 : data.newCodeRegulationMaxVal;
    values = [zone, newCodeRegulationName, newCodeRegulationMinVal, newCodeRegulationMaxVal, unit];
    await pool.query(
        'INSERT INTO attributevalues(zoneName, attributeName, minVal, maxVal, unit) VALUES($1, $2, $3, $4, $5)',
        values
    );
    return res.status(200).json({ Sucess: "Added new zone code regulations" });
})

app.post("/editZoneCompliance/:zoneNameConcat", async(req, res) => {
    const data = req.body.data;
    const attributeName = data.attributeNameToEdit;
    const zone = req.params.zoneNameConcat;
    const unit = data.unit;
    const noMaximum = data.noMaximum;
    const noMinimum = data.noMinimum;
    const keepOriginalUnit = data.keepOriginalUnit;

    if (zone == null || attributeName == null) {
        return res.status(404).json({ error: "Zone or Development Standard Name cannot be null" });
    }

    const newCodeRegulationMinVal = (data.newCodeRegulationMinVal == -1 || noMinimum) ? 0 : data.newCodeRegulationMinVal ;
    const newCodeRegulationMaxVal = (data.newCodeRegulationMaxVal == -1 || noMaximum) ? 2147483647 : data.newCodeRegulationMaxVal;
    if (keepOriginalUnit) {
        values = [newCodeRegulationMinVal, newCodeRegulationMaxVal, zone, attributeName];
        await pool.query(
            'UPDATE attributevalues SET minVal = $1, maxVal = $2 WHERE (zoneName = $3 AND attributeName = $4)',
            values
        );
    } else {
        values = [newCodeRegulationMinVal, newCodeRegulationMaxVal, unit, zone, attributeName];
        await pool.query(
            'UPDATE attributevalues SET minVal = $1, maxVal = $2, unit = $3 WHERE (zoneName = $4 AND attributeName = $5)',
            values
        );
    }
    
    return res.status(200).json({ Sucess: "Edited zone code regulations" });
})

app.post("/deleteZoningRegulations/:zoneNameConcat", async(req, res) => {
    const zone = req.params.zoneNameConcat;
    const attributeToDelete = req.body.attributeToDelete
    const result = await pool.query(
        `DELETE FROM attributevalues 
        WHERE zonename = $1 
        AND attributename = $2`,
        [zone, attributeToDelete]
      );
    if (result == null) {
        return res.status(404).json({ error: "Error: unable to delete zone regulations" });
    }

    return res.status(200).json({ Sucess: "Sucessfully deleted zone regulations" });
})

app.post("/addNewZone", async(req, res) => {
    const newZoneName = req.body.newZoneName;
    const newZoneNameConcat = newZoneName.toLowerCase().replace(/\s/g, '');
    const allZones = await pool.query(
        'SELECT * FROM zones'
    );
    for (const zoneObj of allZones.rows) {
        if (zoneObj['zonenameconcat'] == newZoneNameConcat) {
            console.log("Error: Zone already exists")
            return res.json(false);
        }
    }
    const result = await pool.query(
        'INSERT INTO zones(zoneName, zoneNameConcat) VALUES($1, $2)',
        [newZoneName, newZoneNameConcat]
    );
    if (result == null) {
        return res.status(404).json({ error: "Error: unable to add new zone" });
    }
    console.log("Sucessfully added new zone")
    return res.json(true);
})

app.get("/getAllZones", async(req, res) => {
    const allZones = await pool.query(
        'SELECT * FROM zones'
    );
    return res.json(allZones.rows);
})

app.post("/deleteZone", async(req, res) => {
    const zoneNameToDelete = req.body.zoneNameToDelete.toLowerCase().replace(/\s/g, '');
    const deleteFromZonesTable = await pool.query(
        `DELETE FROM zones 
        WHERE zonenameconcat = $1`,
        [zoneNameToDelete]
      );
    const deleteFromAtrributesTable = await pool.query(
        `DELETE FROM attributevalues 
        WHERE zonename = $1`,
        [zoneNameToDelete]
      );
    if (deleteFromZonesTable == null || deleteFromAtrributesTable == null) {
        return res.status(404).json({ error: "Error: unable to delete zone" });
    }

    return res.status(200).json({ Sucess: "Sucessfully deleted zone" });
})

app.post("/editZone", async(req, res) => {
    const zoneNameToEdit = req.body.zoneNameToEdit;
    const zoneNameToEditConcat = req.body.zoneNameToEdit.toLowerCase().replace(/\s/g, '');

    const newZoneName = req.body.newZoneName;
    const newZoneNameConcat = req.body.newZoneName.toLowerCase().replace(/\s/g, '');

    const allZoneNames = await pool.query(
        `SELECT * FROM zones`
    );
    for (const zoneObj of allZoneNames.rows) {
        if (zoneObj['zonenameconcat'] == newZoneNameConcat) {
            return res.json(false)
        }
    }

    const updateZonesTableResult = await pool.query(
        'UPDATE zones SET zonename = $1, zonenameconcat = $2 WHERE zonename = $3',
        [newZoneName, newZoneNameConcat, zoneNameToEdit]
    );

    const result = await pool.query(
        'UPDATE attributevalues SET zonename = $1 WHERE zonename = $2',
        [newZoneNameConcat, zoneNameToEditConcat]
    );
    if (updateZonesTableResult == null) {
        return res.status(404).json({ error: "Error: unable to update zone" });
    }
    return res.json(true);
})


module.exports = app;