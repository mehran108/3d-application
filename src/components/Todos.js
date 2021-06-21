import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Axios from 'axios';
const Delete = props => {
    return `<span className="fa fa-cros" />${props.value}</span>`
}
const Todos = () => {
    const columnDefs = [
        {
            field: 'id',
        },
        {
            field: 'userId',
        },
        {
            field: 'title',
        },
        {
            field: 'completed',
        },
        {
            field: 'id',
            headerName: '',
            cellRenderer: Delete

        }
    ];
    const [rowData, setRowData] = useState([]);
    const gridOptions = {};
    useEffect(() => {
        Axios.get('https://jsonplaceholder.typicode.com/todos')
            .then(response => {
                setRowData(response.data);
            });
    }, []);
    const onCellClicked = props => {
        console.log(props);
    }
    const onCellDoubleClicked = props => {
        console.log(props);
    }
    return (
        <div
            className="ag-theme-material"
            style={{
                height: '500px',
                width: '1200px'
            }}
        >
            <AgGridReact
                enableSorting="true"
                enableFilter="filter"
                pagination="true"
                paginationPageSize="20"
                onCellClicked={onCellClicked}
                onCellDoubleClicked={onCellDoubleClicked}
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                rowData={rowData}>
            </AgGridReact>
        </div>
    );
};

export default Todos;
