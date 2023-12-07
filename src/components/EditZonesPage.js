import { useState } from 'react';
import { Nav } from "tabler-react";
import { Link } from "react-router-dom";
import { SelectButton } from 'primereact/selectbutton';
import "primereact/resources/themes/lara-light-blue/theme.css";
import ModifyZone from './ModifyZone';
import AddZone from './AddZone';

export default function EditZonesPage() {
    const options = ['Add New Zone', 'Edit / Delete Existing Zone'];
    const [value, setValue] = useState(options[0]);

    const [viewAddZone, setViewAddZone] = useState(true);
    const [viewModifyZone, setViewModifyZone] = useState(false);

    function setView(value) {
      setValue(value)
      if (value == options[0]) {
        setViewAddZone(true)
        setViewModifyZone(false)
      } else {
        setViewModifyZone(true)
        setViewAddZone(false)
      }
    }

    return (
        <div style={{ marginLeft: '2%', marginRight: '2%'}}>
           <ul class="nav nav-tabs">
                <ul class="nav-item">
                    <Link to="/" >
                        Home
                    </Link>
                </ul>
                <ul class="nav-item">
                    <Link to="/EditCodeRegulationsPage" >
                        Edit Code Regulations
                    </Link>
                </ul>
                <ul class="nav-item">
                  <Nav.Item active={true}>
                    Edit Zones
                  </Nav.Item>
                </ul>
                
            </ul>
            <div>
              <SelectButton style={{display: 'inline-flex', marginTop: '2%' }} value={value} onChange={(e) => setView(e.value)} options={options} />
            </div>
            
            {viewAddZone && 
              <AddZone/>
            }
            {viewModifyZone && 
              <ModifyZone/>
            }
        </div>
    )
}
