import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CategoriesListResults from 'src/components/categories/CategoriesListResults';
import CategoriesListToolbar from 'src/components/categories/CategoriesListToolbar';
import categories from 'src/__mocks__/categories';

const CategoriesList = () => (
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
          <CategoriesListResults customers={categories} />
        </Box>
      </Container>
    </Box>
  </>
);

export default CategoriesList;
