import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, Typography } from '@mui/material';

interface MarketListItem {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface DashboardProps {
  columns: GridColDef[];
  marketListData: MarketListItem[];
}

function Dashboard({ columns, marketListData }: DashboardProps) {
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <>
      <div className='mb-3 flex justify-center items-center'>
        <Typography
          variant='h5'
          fontWeight='bold'
          gutterBottom
          className='text-center font-bold'
        >
          Markets Overview
        </Typography>
      </div>
      <div className='dashboard-container z-0 mb-10 rounded-lg flex justify-center'>
        <div className='dashboard-area w-full max-w-6xl'>
          <Paper sx={{ height: '100%', width: '100%' }} elevation={0}>
            <DataGrid
              rows={marketListData}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[10, 20, 30, 40, 50]}
              sx={{
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
              }}
            />
          </Paper>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
