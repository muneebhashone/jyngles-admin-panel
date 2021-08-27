import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  Button
} from '@material-ui/core';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {
  AlertCircle as AlertCircleIcon,
  // BarChart as BarChartIcon,
  // Lock as LockIcon,
  // Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  // User as UserIcon,
  // UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';

// const user = {
//   avatar: '/static/images/avatars/avatar_6.png',
//   jobTitle: 'Admin',
//   name: 'John Doe'
// };

const items = [
  // {
  //   href: '/app/dashboard',
  //   icon: BarChartIcon,
  //   title: 'Dashboard'
  // },
  {
    href: '/admin/customers',
    icon: UsersIcon,
    title: 'Users'
  },
  {
    href: '/admin/categories',
    icon: ShoppingBagIcon,
    title: 'Categories'
  }
  // {
  //   href: '/app/products',
  //   icon: ShoppingBagIcon,
  //   title: 'Products'
  // },
  // {
  //   href: '/app/account',
  //   icon: UserIcon,
  //   title: 'Account'
  // },
  // {
  //   href: '/app/settings',
  //   icon: SettingsIcon,
  //   title: 'Settings'
  // },
  // {
  //   href: '/logout',
  //   icon: LockIcon,
  //   title: 'Logout'
  // }
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
  // {
  //   href: '/admin/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
      navigate('/admin/login', { replace: true });
    }
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        {/* <Avatar
          component={RouterLink}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/app/account"
        >
          <AccountCircleIcon />
        </Avatar> */}
        <Typography color="textPrimary" variant="h5">
          Admin
        </Typography>
        {/* <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography> */}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
        <Button
          fullWidth
          onClick={handleLogout}
          style={{ textTransform: 'capitalize' }}
        >
          Logout
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default DashboardSidebar;
