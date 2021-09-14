/* eslint-disable */

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CategoriesListResults from 'src/components/categories/CategoriesListResults';
import CategoriesListToolbar from 'src/components/categories/CategoriesListToolbar';
import { useQuery } from '@apollo/client';
import { getAllCategories } from 'src/GraphQL/Queries';
import LoadingSpinner from 'src/components/ui/loading-spinner';
import string from 'string-sanitizer';

const CategoriesList = () => {
  const { data, loading, refetch } = useQuery(getAllCategories);
  const [newData, setNewData] = useState(null);
  const [search, setSearch] = useState();

  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    console.log(newData);
  }, [newData]);

  useEffect(() => {
    if (!loading) {
      setNewData(data.getAllCategories.map((dataItem) => dataItem).reverse());
    }

    if (!loading && search) {
      if (search !== '') {
        const regex = new RegExp(string.sanitize.keepSpace(search), 'gi');
        setNewData((selectData) =>
          selectData.filter((category) => category.name.match(regex))
        );
      }

      if (search === '') {
        setNewData(data.getAllCategories.map((dataItem) => dataItem).reverse());
      }
    }
  }, [data, search]);

  return (
    <>
      <Helmet>
        <title>Categories | Jyngles</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <CategoriesListToolbar
            refetch={refetch}
            handleCategorySearch={handleSearch}
          />
          <Box sx={{ pt: 3 }}>
            {newData === null ? (
              <LoadingSpinner />
            ) : (
              <CategoriesListResults customers={newData} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CategoriesList;
