import { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function AddZone() {
    const [newZoneName, setNewZoneName] = useState("");
    const [content, setContent] = useState(null)
    const [severity, setSeverity] = useState(null)
    const toast = useRef(null);

    useEffect(() => {
        if (content != null) {
          toast.current.show({ severity: severity, detail: content });
          setContent(null);
        }
      }, [content]);

    async function addNewZone() {
        try {
            const response = await fetch(`https://zoning-server.onrender.com:4000/addNewZone`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newZoneName }),
            });
            const result = await response.json();
            if (!result) {
                setContent("Error: Zone already exists. Please use a different name")
                setSeverity("error")
            } else {
                setContent("Successfully added new zone")
                setSeverity("success")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h3 style={{ marginTop: '3%' }}> Add Zone</h3>
            <div style={{marginRight: '2%'}} className="flex justify-content-center">
                <InputText 
                    style={{marginRight: '2%', width: '25%'}} 
                    placeholder="Zone Name"
                    onChange={(e) => setNewZoneName(e.target.value)}
                />
            </div>
            <Button
                style={{ marginTop: '5%', backgroundColor: 'green', borderRadius: '5px'}}
                type="submit" 
                onClick={() => addNewZone()}> Add New Zone
            </Button>
            <Toast ref={toast}/>
        </div>
    )
}