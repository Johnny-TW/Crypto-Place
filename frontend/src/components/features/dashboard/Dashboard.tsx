import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Typography } from '@mui/material';
import { DataTable } from '@components/shared/data-display';

interface DashboardProps {
  columns: ColumnDef<any>[];
  marketListData: any[];
}

function Dashboard({ columns, marketListData }: DashboardProps) {
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
      <div className='dashboard-container z-0 mb-8 rounded-lg flex justify-center'>
        <div className='dashboard-area w-full max-w-6xl'>
          <DataTable
            columns={columns}
            data={marketListData || []}
            pageSize={10}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
