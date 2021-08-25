/* eslint-disable */

import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListResults from 'src/components/customer/CustomerListResults';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import customers from 'src/__mocks__/customers';
import LoadingSpinner from 'src/components/ui/loading-spinner';
import { useQuery } from '@apollo/client';
import { getAllUsers } from 'src/GraphQL/Queries';

const CustomerList = () => {
  const { data, loading, error } = useQuery(getAllUsers);

  return (
    <>
      <Helmet>
        <title>Users | Jyngles</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar />
          <Box sx={{ pt: 3 }}>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <CustomerListResults customers={data.getAllUsers} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerList;
