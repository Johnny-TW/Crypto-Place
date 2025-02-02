import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

function BasicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  // console.log(pathnames);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link className="no-underline" color="textPrimary" component={RouterLink} to="/">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="textPrimary" key={to}>
            {value}
          </Typography>
        ) : (
          <Typography color="textPrimary" key={to}>
            {value}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

export default BasicBreadcrumbs;
