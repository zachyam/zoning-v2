import { useState, useMemo } from 'react';
import { Nav } from "tabler-react";
import { Link } from "react-router-dom";
import ZoneSelection from "./ZoneSelection";
import ZoneRegulations from "./ZoneRegulations";
import {
    MDBRow,
    MDBCol,
    MDBInput
  } from "mdb-react-ui-kit"


export default function HomePage() {
    const [zone, setZone] = useState("");
    const [projectAddress, setProjectAddress] = useState('');
    const [apn, setApn] = useState('')
    const [projectCode, setProjectCode] = useState('')
    const [projectNumber, setProjectNumber] = useState('');
    const [projectApplicant, setProjectApplicant] = useState('');
    const [allZones, setAllZones] = useState("");
    const [rowModified, setRowModified] = useState(false);
    
    async function getZones() {
        try {
          const response = await fetch(`http://localhost:4000/getAllZones`)
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
          console.log(allZoneNames)
        } catch (err) {
          console.error(err)
        }
      }
    
    useMemo(() => {
        getZones();
    } , []);

    return (
        <div style={{ marginLeft: '2%', marginRight: '2%', paddingBottom: '2%'}}>
            <div >
                <ul class="nav nav-tabs">
                    <Nav.Item active={true}>
                        Home
                    </Nav.Item>
                    <ul class="nav-item">
                        <Link to="/EditCodeRegulationsPage" >
                            Edit Code Regulations
                        </Link>
                    </ul>
                    <ul class="nav-item">
                        <Link to="EditZonesPage">
                            Edit Zones
                        </Link>
                    </ul>
                    
                </ul>
        
             </div>
            <ZoneSelection 
                zone={zone}
                allZones={allZones}
                setZone={setZone}
            />
            <MDBRow>
                <MDBCol md="3">
                    <form>
                        <div style={{ fontSize: '14px'}} className="grey-text">
                            <MDBInput 
                            label="Project Address" 
                            icon="user" 
                            group type="text" 
                            validate error="wrong" 
                            success="right" 
                            onChange={(e) => setProjectAddress(e.target.value)} />
                            <MDBInput 
                            label="Project Number" 
                            icon="envelope" 
                            group type="email" 
                            validate error="wrong" 
                            success="right"
                            onChange={(e) => setProjectNumber(e.target.value)} />
                            <MDBInput 
                            label="Project Applicant" 
                            icon="tag" 
                            group type="text" 
                            validate error="wrong" 
                            success="right" 
                            onChange={(e) => setProjectApplicant(e.target.value)}/>
                        </div>
                    </form>
                </MDBCol>
                <MDBCol md="3">
                    <form>
                        <div style={{ fontSize: '14px'}} className="grey-text">
                            <MDBInput 
                            type="APN" 
                            label="APN" 
                            icon="pencil-alt" 
                            onChange={(e) => setApn(e.target.value)}/>
                            <MDBInput 
                            type="code" 
                            label="Code" 
                            icon="pencil-alt" 
                            onChange={(e) => setProjectCode(e.target.value)}/>
                        </div>
                    </form>
                </MDBCol>
            </MDBRow>
            <ZoneRegulations 
                zone={zone} 
                projectAddress={projectAddress}
                apn={apn}
                projectNumber={projectNumber}
                projectApplicant={projectApplicant}
                projectCode={projectCode}
                rowModified={rowModified}
                setRowModified={setRowModified}/>
        </div>
    )
    
}