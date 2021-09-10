/* eslint-disable */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListResults from 'src/components/customer/CustomerListResults';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import LoadingSpinner from 'src/components/ui/loading-spinner';
import { useQuery } from '@apollo/client';
import { getAllUsers } from 'src/GraphQL/Queries';
import string from 'string-sanitizer';

const CustomerList = () => {
  const { data, loading, error, refetch } = useQuery(getAllUsers);
  const [newData, setNewData] = useState(null);
  const [search, setSearch] = useState('');

  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (!loading) {
      setNewData(data.getAllUsers.map((dataItem) => dataItem));
      console.log(newData);
    }

    if (!loading && search) {
      if (search !== '') {
        const regex = new RegExp(string.sanitize.keepSpace(search), 'gi');
        setNewData((selectData) =>
          selectData.filter(
            (user) => user.name.match(regex) || user.email.includes(search)
          )
        );
      }

      if (search === '') {
        setNewData(data.getAllUsers.map((dataItem) => dataItem));
      }
    }
  }, [data, search]);

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
          <CustomerListToolbar handleCategorySearch={handleSearch} />
          <Box sx={{ pt: 3 }}>
            {newData === null ? (
              <LoadingSpinner />
            ) : (
              <CustomerListResults customers={newData} refetch={refetch} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerList;
