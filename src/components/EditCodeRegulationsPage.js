import { useMemo, useState } from 'react';
import { getZoneComplianceValues } from '../utils.js'
import { Nav } from "tabler-react";
import { Link } from "react-router-dom";
import ZoneSelection from './ZoneSelection.js'
import AddNewRegulation from './AddNewRegulation.js';
import ModifyRegulations from './ModifyRegulations.js';
import { SelectButton } from 'primereact/selectbutton';
import "primereact/resources/themes/lara-light-blue/theme.css";

export default function EditCodeRegulationsPage() {
    const [zoneComplianceValues, setZoneComplianceValues] = useState({});
    const [zone, setZone] = useState("");
    const [allZones, setAllZones] = useState("");
    const [rows, setRows] = useState({});
    const [newCodeRegulationName, setNewCodeRegulationName] = useState("");
    const [newCodeRegulationVal, setNewCodeRegulationVal] = useState(-1);
    const [newCodeRegulationMinVal, setNewCodeRegulationMinVal] = useState(-1);
    const [newCodeRegulationMaxVal, setNewCodeRegulationMaxVal] = useState(-1);
    const [noMinimum, setNoMinimum] = useState(false);
    const [noMaximum, setNoMaximum] = useState(false);
    const [keepOriginalUnit, setKeepOriginalUnit] = useState(false);
    const [unit, setUnit] = useState("");
    const [rowModified, setRowModified] = useState(false);
    const [regulationToEdit, setRegulationToEdit] = useState({});
    const [viewAddRegulation, setViewAddRegulation] = useState(true);
    const [viewModifyRegulation, setViewModifyRegulation] = useState(false);
    const options = ['Add New Development Standard', 'Edit / Delete Existing Development Standard' ];
    const [value, setValue] = useState(options[0]);

    useMemo(() => {
      getZones();
    } , []);

    async function getZones() {
      try {
        const response = await fetch(`https://zoning-server.onrender.com/getAllZones`)
        const callback = await response.json();
        if (callback == []) {
          return;
        }
        let allZoneNames = []
        for (const item of callback) {
          const obj = {
              name: item.zonename,
              code: item.zonenameconcat
          }
          allZoneNames.push(obj)
        }
        if (allZoneNames != null) {
          setZone(allZoneNames[0])
        }
        setAllZones(allZoneNames);
      } catch (err) {
        console.error(err)
      }
    }

    function setView(value) {
      setValue(value)
      if (value == options[0]) {
        setViewAddRegulation(true)
        setViewModifyRegulation(false)
      } else {
        setViewModifyRegulation(true)
        setViewAddRegulation(false)
      }
      setNewCodeRegulationName("");
      setNewCodeRegulationVal(-1);
      setNewCodeRegulationMinVal(-1);
      setNewCodeRegulationMaxVal(-1);
      setNoMinimum(false);
      setNoMaximum(false);
      setUnit("");
      setRegulationToEdit({})
    }
    return (
        <div style={{ marginLeft: '2%', marginRight: '2%'}}>
            <ul class="nav nav-tabs">
                <ul class="nav-item">
                  <Link to="/">
                    Home
                  </Link>
                </ul>
                <ul class="nav-item">
                    <Nav.Item active={true}>
                        Edit Code Regulations
                    </Nav.Item>
                </ul>
                <ul class="nav-item">
                    <Link to="/EditZonesPage">
                        Edit Zones
                    </Link>
                </ul>
                    
            </ul>
            <ZoneSelection 
                zone={zone}
                setZone={setZone}
                allZones={allZones}
            />
            <div>
              <SelectButton style={{display: 'inline-flex'}} value={value} onChange={(e) => setView(e.value)} options={options} />
            </div>

            {viewModifyRegulation &&
              <ModifyRegulations
                rows={rows}
                setRows={setRows}
                zone={zone}
                zoneComplianceValues={zoneComplianceValues}
                getZoneComplianceValues={getZoneComplianceValues}
                setZoneComplianceValues={setZoneComplianceValues}
                regulationToEdit={regulationToEdit}
                setRegulationToEdit={setRegulationToEdit}
                newCodeRegulationName={newCodeRegulationName}
                setNewCodeRegulationName={setNewCodeRegulationName}
                newCodeRegulationVal={newCodeRegulationVal}
                setNewCodeRegulationVal={setNewCodeRegulationVal}
                newCodeRegulationMinVal={newCodeRegulationMinVal}
                setNewCodeRegulationMinVal={setNewCodeRegulationMinVal}
                newCodeRegulationMaxVal={newCodeRegulationMaxVal}
                setNewCodeRegulationMaxVal={setNewCodeRegulationMaxVal}
                noMinimum={noMinimum}
                setNoMinimum={setNoMinimum}
                noMaximum={noMaximum}
                setNoMaximum={setNoMaximum}
                unit={unit}
                setUnit={setUnit}
                rowModified={rowModified}
                setRowModified={setRowModified}
                keepOriginalUnit={keepOriginalUnit}
                setKeepOriginalUnit={setKeepOriginalUnit}
              />
            }

            {viewAddRegulation &&
              <AddNewRegulation
                zone={zone}
                newCodeRegulationName={newCodeRegulationName}
                setNewCodeRegulationName={setNewCodeRegulationName}
                newCodeRegulationVal={newCodeRegulationVal}
                setNewCodeRegulationVal={setNewCodeRegulationVal}
                newCodeRegulationMinVal={newCodeRegulationMinVal}
                setNewCodeRegulationMinVal={setNewCodeRegulationMinVal}
                newCodeRegulationMaxVal={newCodeRegulationMaxVal}
                setNewCodeRegulationMaxVal={setNewCodeRegulationMaxVal}
                noMinimum={noMinimum}
                setNoMinimum={setNoMinimum}
                noMaximum={noMaximum}
                setNoMaximum={setNoMaximum}
                unit={unit}
                setUnit={setUnit}
                setRowModified={setRowModified}
              />
            }
        </div>
        
    )
}