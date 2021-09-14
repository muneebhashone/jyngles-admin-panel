import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, Toolbar } from '@material-ui/core';

import Logo from './Logo';

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => (
  <AppBar elevation={0} {...rest}>
    <Toolbar>
      <RouterLink to="/admin/">
        <Logo />
      </RouterLink>
      <Box sx={{ flexGrow: 1 }} />
    </Toolbar>
  </AppBar>
);

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
