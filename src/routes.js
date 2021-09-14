import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import CustomerList from 'src/pages/CustomerList';
import CategoriesList from 'src/pages/CategoriesList';
import SubCategoriesList from 'src/pages/SubCategoriesList';
// import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
// import ProductList from 'src/pages/ProductList';
// import Register from 'src/pages/Register';
// import Settings from 'src/pages/Settings';

const routes = [
  {
    path: 'admin',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      // { path: 'dashboard', element: <Dashboard /> },
      { path: 'categories/:id', element: <SubCategoriesList /> },
      { path: 'categories', element: <CategoriesList /> },
      // { path: 'products', element: <ProductList /> },
      // { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'admin',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      // { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
