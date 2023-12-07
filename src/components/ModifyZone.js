import { useEffect, useMemo, useRef, useState } from 'react';
import DataGrid from 'react-data-grid';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog';
import { rowKeyGetter } from '../utils.js'
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function ModifyZone() {
    const [open, setOpen] = useState(false);
    const [zoneModified, setZoneModified] = useState(false);
    const [allZones, setAllZones] = useState([]);
    const [rows, setRows] = useState({});
    const [zoneNameToEdit, setZoneNameToEdit] = useState("");
    const [newZoneName, setNewZoneName] = useState("");
    const [severity, setSeverity] = useState(null);
    const [content, setContent] = useState(null);
    const toast = useRef(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        getZones();
    }, [zoneModified]);

    useEffect(() => {
        if (content != null) {
          toast.current.show({ severity: severity, detail: content });
          setContent(null);
        }
      }, [content]);

    const clearModal = () => {
        setZoneNameToEdit("")
        setNewZoneName("")
        handleClose();
    }

    async function getZones() {
        try {
          const response = await fetch(`https://zoning-server.onrender.com/getAllZones`)
          const callback = await response.json();
          if (callback == []) {
            return;
          }
          let allZoneNames = []
          for (const item of callback) {
            const zoneName = item.zonename;
            allZoneNames.push(zoneName)
          }
          setAllZones(allZoneNames);
          setRows(createRows(allZoneNames))
          setZoneModified(false);
        } catch (err) {
          console.error(err)
        }
      }
    
    async function deleteZone(zoneNameToDelete) {
        try {
            const response = await fetch(`https://zoning-server.onrender.com:4000/deleteZone`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ zoneNameToDelete }),
            });
            const result = await response.json();
            setZoneModified(true);
            setContent("Successfully deleted zone");
            setSeverity("success")
        } catch (error) {
            console.log(error)
            setContent("There was an error deleting zone. Please try again");
            setSeverity("error")
        }
    }

    async function confirmDelete(zoneName) {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteZone(zoneName),
          });
    };

    function editRow(zoneNameToEdit) {
        setZoneNameToEdit(zoneNameToEdit)
        handleOpen(true);
    }

    async function saveEditRow() {
        try {
            const response = await fetch(`http://localhost:4000/editZone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ zoneNameToEdit, newZoneName }),
            });
            const result = await response.json();
            console.log(result)
            if (result) {
                setContent("Successfully edited zone");
                setSeverity("success")
            } else {
                setContent("There was an error editing zone. Please try again");
                setSeverity("error")
            }
        } catch (error) {
            console.log(error)
            setContent("There was an error editing zone. Please try again");
            setSeverity("error")
        }
        handleClose();
        setZoneModified(true);
    }

    function getColumns() {
        return [
          {
            key: 'zoneName',
            name: 'Zone Name',
            frozen: true,
            resizable: false
          },
          {
            key: "modify",
            name: "",
            renderCell: (props) => (
              <div >
                <Button
                  label="Edit"
                  style={{ backgroundColor: 'green', borderColor:'white'}}
                  type="submit"
                  onClick={() => editRow(props.row.zoneName)}>
                </Button>
                <Button
                  label="Delete"
                  style={{ backgroundColor: '#B74C4C', borderColor: 'white'}}
                  type="submit"
                  onClick={() => confirmDelete(props.row.zoneName)}> 
                </Button>
              </div>
                  
            )
          },
        ];
    }

    function createRows(allZoneNames) {
        const rows = []
        for (const zone of allZoneNames) {
          const row = {
            zoneName: zone
          }
          rows.push(row)
        }
        return rows;
      }
    
    const columns = useMemo(() => {
        // Ensure that allZones is populated before calling getColumns
        if (allZones) {
            return getColumns()
        }
    }, [allZones]);

    const gridStyle = {
        width: '30%',
        height: '100%'
      };

    return (
        <div>
            <Dialog header="Edit Zone Name" visible={open} style={{ width: '30vw' }} onHide={() => handleClose()}>
                <div style={{width: '25%', marginRight: '2%', marginBottom: '5%'}} className="flex justify-content-center">
                    <InputText 
                        style={{marginRight: '2%', marginBottom: '2%'}} 
                        placeholder="Edit Zone Name" 
                        onChange={(e) => setNewZoneName(e.target.value)}/>
                </div>
                <div style={{width: '30%', display: 'inline', marginBottom: '5%'}} className="card flex justify-content-center">
                    <Button
                        style={{ backgroundColor: 'green', borderColor:'white'}}
                        type="submit"
                        onClick={() => saveEditRow()}>Save changes
                    </Button>
                    <Button
                        style={{ backgroundColor: '#B74C4C', borderColor:'white'}}
                        type="submit"
                        onClick={() => clearModal()}>Cancel
                    </Button>
                    
                </div>
            </Dialog>
            <h3 style={{ marginTop: '3%' }}> Edit / Delete Zones </h3>
            <DataGrid
                rowKeyGetter={rowKeyGetter}
                columns={columns}
                rows={rows}
                rowHeight={45}
                onRowsChange={setRows}
                className="fill-grid"
                maxWidth={30}
                style={gridStyle}
            />
            <Toast ref={toast}/>
            <ConfirmDialog />
        </div>
    )
}