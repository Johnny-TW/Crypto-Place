import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function Dashboard({ columns, marketListData }) {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const rows = Array.isArray(marketListData) ? marketListData : [];

  return (
    <div className="dashboard-container z-0 mb-10 rounded-lg">
      <div className="dashboard-area">
        <div className="mb-3 grid grid-cols-12 gap-2 items-center">
          <div className="col-span-1" />
          <div className="col-span-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
              Markets Overview
            </h2>
          </div>
          <div className="col-span-1" />
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={rows.length}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50]}
            className="border border-gray-300"
            autoHeight
            getRowId={(row) => row.id}
            checkboxSelection={false}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
