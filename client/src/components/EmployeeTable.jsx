// import React, { useEffect, useState, lazy } from 'react';
// // import Session from '../../utils/api/Session';
// import Swal from '../../utils/Swal';
// import * as React from 'react';
import React, { useEffect, useState, lazy } from 'react';
// import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EmployeeAPI, {Employee} from '../utils/api/employee/EmployeeAPI';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import {
  randomId,
} from '@mui/x-data-grid-generator';


  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;
  
    const handleClick = () => {
      const id = randomId();
      setRows((oldRows) => [{ id, firstName: '', lastName: '', salary: 0, isNew: true }, ...oldRows]);
      setRowModesModel((oldModel) => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'firstName' },
        ...oldModel,
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

function EmployeeTable(){
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

    const loadEmployeesTable = () => {
        EmployeeAPI.getAPI()
            .get()
            .then((data) => {
              setRows(data.map((a)=>a.employee));
            });
    };

    useEffect(() => {
        loadEmployeesTable();
    }, []);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
      console.log("id=", id);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
      console.log("handleSaveClick", id);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        // setRows(rows.filter((row) => row.id !== id));
        EmployeeAPI.delete(id)
        .then((data) => {
          console.log("delete", data);
          if (data){
            loadEmployeesTable();
          }
        });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
          setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
      if (newRow.isNew){
        EmployeeAPI.create(newRow.firstName, newRow.lastName, newRow.salary)
        .then((data) => {
          if (data?.id){
            console.log("success");
            loadEmployeesTable();
        }})
        .catch((error)=>{
          console.error(error);
        });
      }
      else{
        EmployeeAPI
        .edit(newRow.id, newRow.firstName, newRow.lastName, newRow.salary)
        .then((data) => {
          console.log("edit", data);
        });
      }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { 
            field: 'firstName', 
            headerName: 'First Name', 
            width: 200, 
            align: 'left',
            headerAlign: 'left',
            editable: true 
        },
        { 
            field: 'lastName', 
            headerName: 'Last Name', 
            width: 200, 
            align: 'left',
            headerAlign: 'left',
            editable: true 
        },
        {
          field: 'salary',
          headerName: 'Salary',
          type: 'number',
          width: 100,
          align: 'right',
          headerAlign: 'right',
          editable: true,
        },
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 300,
          align: 'center',
          headerAlign: 'center',
          cellClassName: 'actions',
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    
            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }
    
            return [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        },
      ];

    return (
        <Box
            sx={{
            height: '100%',
            width: '100%',
            '& .actions': {
                color: 'text.secondary',
            },
            '& .textPrimary': {
                color: 'text.primary',
            },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                onProcessRowUpdateError={error => {console.log(error)}}
            />
        </Box>);
};

export default EmployeeTable;