import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import CustomerList from 'src/pages/CustomerList';
import CategoriesList from 'src/pages/CategoriesList';
import BugList from 'src/pages/BugList';
import SubCategoriesList from 'src/pages/SubCategoriesList';
import Login from 'src/pages/Login';

const routes = [
  {
    path: 'admin',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <CustomerList /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'categories/:id', element: <SubCategoriesList /> },
      { path: 'categories', element: <CategoriesList /> },
      { path: 'bugs', element: <BugList /> },
      { path: '*', element: <Navigate to="/admin" /> }
    ]
  },
  {
    path: 'admin',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/admin" /> }
    ]
  }
];

export default routes;
