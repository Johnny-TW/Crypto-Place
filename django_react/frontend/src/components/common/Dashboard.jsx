import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Grid } from '@mui/material';

function Dashboard({ columns, marketListData }) {
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="dashboard-container z-0 mb-10 rounded-lg shadow-md">
      <div className="dashboard-area">
        <Grid className="mb-3" container spacing={2} alignItems="center">
          <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>
            {/* 空的區域 */}
          </Grid>
          <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Markets Overview</h2>
          </Grid>
          <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>
            {/* 空的區域 */}
          </Grid>
        </Grid>
        <Paper sx={{ height: '100%', width: '100%' }} elevation={1}>
          <DataGrid
            rows={marketListData}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20, 30, 40, 50]}
            sx={{
              border: '1px solid #ccc', // 設置邊框
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // 設置陰影
              cursor: 'pointer',
              backgroundColor: '#f5f5f5', // 設置背景顏色
              '& .MuiDataGrid-root': {
                '@media (max-width: 600px)': {
                  fontSize: '0.8rem', // 調整字體大小
                },
              },
            }}
          />
        </Paper>
      </div>
    </div>
  );
}

export default Dashboard;
