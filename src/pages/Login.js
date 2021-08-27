/* eslint-disable */

import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import { adminLogin as ADMIN_LOGIN } from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [adminLogin, { data, loading, error }] = useMutation(ADMIN_LOGIN);
  const notify = () =>
    toast('Invalid Credentials, Please try again', {
      style: {
        backgroundColor: 'red',
        color: 'white'
      },
      hideProgressBar: true
    });

  const handleLogin = (values) => {
    const loginAdmin = async () => {
      try {
        const { data } = await adminLogin({
          variables: { email: values.email, password: values.password }
        });
        localStorage.setItem('currentUser', JSON.stringify(data.adminLogin));
        navigate('/admin/customers', { replace: true });
        location.reload();
      } catch (err) {
        console.log(err.message);
        notify();
      }
    };
    loginAdmin();

    useEffect(() => {
      if (localStorage.getItem('currentUser')) {
        navigate('/admin/customers', { replace: true });
      }
    }, [localStorage.getItem('currentUser')]);
  };

  return (
    <>
      <Helmet>
        <title>Login | Jyngles</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values) => {
              handleLogin(values);
              // navigate('/app/customers', { replace: true });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    Sign in
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
        <ToastContainer />
      </Box>
    </>
  );
};

export default Login;
