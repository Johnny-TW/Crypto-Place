import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

function BasicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatPathName = (path) => path
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        className="no-underline"
        color="inherit"
        component={RouterLink}
        to="/"
      >
        Home
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const displayName = formatPathName(value);

        return (
          <Typography color="textPrimary" key={to}>
            {displayName}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

export default BasicBreadcrumbs;
