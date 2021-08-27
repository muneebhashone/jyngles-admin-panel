import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CategoriesListResults from 'src/components/categories/CategoriesListResults';
import CategoriesListToolbar from 'src/components/categories/CategoriesListToolbar';
import { useQuery } from '@apollo/client';
import { getAllCategories } from 'src/GraphQL/Queries';
import LoadingSpinner from 'src/components/ui/loading-spinner';

const CategoriesList = () => {
  const { data, loading } = useQuery(getAllCategories);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
          <CategoriesListToolbar />
          <Box sx={{ pt: 3 }}>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <CategoriesListResults customers={data.getAllCategories} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CategoriesList;
