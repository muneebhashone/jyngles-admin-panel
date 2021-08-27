import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import UserProvider from 'src/context/Context';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const routing = useRoutes(routes);

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {routing}
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
