import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

function Dashboard({ columns, marketListData }) {
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className='dashboard-container z-0 mb-10 rounded-lg'>
      <div className='dashboard-area'>
        <div className='mb-3 grid grid-cols-12 gap-2 items-center'>
          <div className='col-span-12 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1'>
            {/* 空的區域 */}
          </div>
          <div className='col-span-12 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-10'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 text-center'>
              Markets Overview
            </h2>
          </div>
          <div className='col-span-12 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1'>
            {/* 空的區域 */}
          </div>
        </div>
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
  );
}

export default Dashboard;
