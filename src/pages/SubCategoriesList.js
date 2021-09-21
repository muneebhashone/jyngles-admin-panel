/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import SubCategoriesListResults from 'src/components/categories/SubCategoriesListResults';
import CategoriesListToolbar from 'src/components/categories/CategoriesListToolbar';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { getAllCategories } from 'src/GraphQL/Queries';
import LoadingSpinner from 'src/components/ui/loading-spinner';

const SubCategoriesList = () => {
  const { data, loading, refetch } = useQuery(getAllCategories);
  const [newData, setNewData] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (!loading && newData && !newData[0]) {
      navigate('/admin/categories');
    }
  }, [newData]);

  useEffect(() => {
    if (!loading) {
      setNewData(
        data.getAllCategories
          .filter((dataItem) => dataItem._id === params.id)
          .map((dataItem) => dataItem.subCats)
          .reverse()
      );
    }

    // if (!loading && search) {
    //   if (search !== '') {
    //     const regex = new RegExp(string.sanitize.keepSpace(search), 'gi');
    //     setNewData((selectData) =>
    //       selectData[0].filter((category) => category.name.match(regex))
    //     );
    //   }

    //   if (search === '') {
    //     setNewData(
    //       data.getAllCategories
    //         .filter((dataItem) => dataItem._id === params.id)
    //         .map((dataItem) => dataItem.subCats)
    //         .reverse()
    //     );
    //   }
    // }
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
          <CategoriesListToolbar
            // refetch={refetch}
            // handleCategorySearch={handleSearch}
            hideSearch
          />
          <Box sx={{ pt: 3 }}>
            {!newData || !newData[0] ? (
              <LoadingSpinner />
            ) : (
              <SubCategoriesListResults
                customers={newData[0]}
                refetchQuery={refetch}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SubCategoriesList;
