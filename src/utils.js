function getCodeRegulations(minVal, maxVal, unit) {
    if (minVal != null || maxVal != null) {
      // if there is min and max
      if (minVal != null && maxVal != 2147483647) {
        return '' + minVal + ' to ' + maxVal + ' ' + (unit != null ? unit : '')
      }
      // there is only min
      else {
        return minVal + ' ' + (unit != null ? unit : '')     
      }
    }
    console.log("Error: no codeRegulations found")
  }

  export function createRows(zoneComplianceValues) {
    const rows = []
    for (const attribute in zoneComplianceValues) {
      const key = zoneComplianceValues[attribute];
      const row = {
        attribute: attribute,
        codeRegulations: getCodeRegulations(key.minVal, key.maxVal, key.unit),
        projectSpecifications: '',
        codeCompliant: '',
        remarks: ''
      }
      rows.push(row)
    }
    return rows;
  }

  export function rowKeyGetter(row) {
    return row.id;
  }

  export async function getZoneComplianceValues(zone, setRows, setZoneComplianceValues, setRowModified) {
    try {
      const zoneNameConcat = zone['code'];
      const response = await fetch(`https://zoning-server.onrender.com:4000/getZoneCompliance/${zoneNameConcat}`)
      const callback = await response.json();
      const zoneComplianceValues = {};
      if (callback != null) {
        for (const item of callback) {
          const attributeName = item.attributename;
          const minVal = item.minval;
          const maxVal = item.maxval;
          const unit = item.unit;
    
          zoneComplianceValues[attributeName] = { minVal, maxVal, unit };
        }
      }
      
      setZoneComplianceValues(zoneComplianceValues);
      setRows(createRows(zoneComplianceValues));
      setRowModified(false);
    } catch (err) {
      console.error(err)
    }
  }