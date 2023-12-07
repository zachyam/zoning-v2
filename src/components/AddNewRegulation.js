import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';

export default function AddNewRegulation({ zone, newCodeRegulationName, setNewCodeRegulationName, newCodeRegulationVal, newCodeRegulationMinVal, 
                                           setNewCodeRegulationMinVal, newCodeRegulationMaxVal, setNewCodeRegulationMaxVal, 
                                           setNoMinimum, noMinimum, setNoMaximum, noMaximum, unit, setUnit, setRowModified }
                                           ) {

    const [content, setContent] = useState(null);
    const [severity, setSeverity] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        if (content != null) {
            toast.current.show({ severity: severity, detail: content });
            setContent(null);
        }
        }, [content]);
                         
    function validateInputs() {
        if (newCodeRegulationName == "" || newCodeRegulationName == null) {
            setContent("New development standard name cannot be empty")
            setSeverity("error")
            return false;
        }
        if ((newCodeRegulationMinVal == "" || newCodeRegulationMinVal == -1) && noMinimum == false) {
            setContent("Minimum value cannot be empty. Either add a value or select no minimum")
            setSeverity("error")
            return false;

        }
        if ((newCodeRegulationMaxVal == "" || newCodeRegulationMaxVal == -1) && noMaximum == false) {
            setContent("Maximum value cannot be empty. Either add a value or select no maximum")
            setSeverity("error")
            return false;
        }
        return true;
    }

    async function addNewRegulation() {
        if (!validateInputs()) {
            return;
        }
        try {
            const zoneNameConcat = zone['code'];
            const data = { newCodeRegulationName, newCodeRegulationVal, newCodeRegulationMinVal, newCodeRegulationMaxVal, unit, noMaximum, noMinimum }
            console.log(data)
            const response = await fetch(`http://localhost:4000/addZoneCompliance/${zoneNameConcat}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
            });

            const responseData = await response.json();
            console.log(responseData);
            setRowModified(true);
            setContent("Successfully added development standard")
            setSeverity("success")
        } catch (error) {
            console.error(error);
            setContent("Error with submitting new development standard. Please try again")
            setSeverity("error")
        }
    }
    
    return (
        <div>
            <h3 style={{ marginTop: '3%' }}> Add New Development Standard to {zone['name']}</h3>
            <div style={{marginRight: '2%', display:'inline'}} className="flex justify-content-center">
                    <InputText 
                        style={{marginRight: '2%', width: '25%'}} 
                        placeholder="Development Standard Name" 
                        onChange={(e) => setNewCodeRegulationName(e.target.value)}/>
                    <InputText
                        label="Unit" 
                        group type="text"
                        placeholder='Unit'
                        validate error="wrong" 
                        success="right" 
                        onChange={(e) => setUnit(e.target.value)}
                    />
            </div>
            <div style={{marginTop: '1%', marginBottom: '1%'}} className="flex align-items-center">
                        <InputText 
                            label="Minimum Value" 
                            group type="text" 
                            validate error="wrong" 
                            success="right" 
                            onChange={(e) => setNewCodeRegulationMinVal(e.target.value)}
                            disabled={noMinimum}
                        />
            </div>
            <div style={{marginBottom: '1%'}}className="flex align-items-center">
                    <Checkbox 
                        name='No Minimum' 
                        value=''
                        id='flexCheckMin' 
                        label='No Minimum' 
                        checked={noMinimum}
                        onChange={() => setNoMinimum(!noMinimum)}
                    />
                    <label style={{marginBottom: '0'}}htmlFor="No Minimum" className="ml-2">No Minimum</label>

            </div>

                <InputText 
                    label="Maximum Value" 
                    group type="text" 
                    validate error="wrong" 
                    success="right" 
                    onChange={(e) => setNewCodeRegulationMaxVal(e.target.value)}
                    disabled={noMaximum}
                />

                <div style={{marginTop: '1%', marginBottom: '1%'}} className="flex align-items-center">
                    <Checkbox 
                        name='No Maximum' 
                        value='' 
                        id='flexCheckMax' 
                        label='No Maximum' 
                        checked={noMaximum}
                        onChange={() => setNoMaximum(!noMaximum)}
                    />
                    <label style={{marginBottom: '0'}}htmlFor="No Maximum" className="ml-2">No Maximum</label>

                </div>

            <Button
                style={{ marginTop: '2%', backgroundColor: 'green', borderRadius: '5px'}}
                type="submit"
                onClick={() => addNewRegulation()}>Add New Development Standard
            </Button>
            <Toast ref={toast}/>
        </div>
    )

}
