import { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';

export default function ZoneSelection({ zone, allZones, setZone}) {

  useEffect(() => {

  }, [zone]);

  return (
    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '20px', marginBottom: '20px'}}>
    //   <ZoneSelectionList />
    //   <p style={{ fontSize: '16px', textIndent: '4px' }}>{zone} Zoning Regulations</p>
    // </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '20px', marginBottom: '20px'}}>
      <Dropdown style={{ paddingLeft: '0px' }} value={zone} onChange={(e) => setZone(e.value)} options={allZones} optionLabel="name" 
        placeholder="Select a Zone"/>
      <p style={{ fontSize: '16px', textIndent: '4px', marginTop: '1%'}}> {zone && zone['name']} Zoning Regulations</p>
    </div>
      

  );
}
