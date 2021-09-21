/* eslint-disable */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import BugListResults from 'src/components/bug/BugListResults';
import BugListToolbar from 'src/components/bug/BugListToolbar';
import LoadingSpinner from 'src/components/ui/loading-spinner';
import { useQuery } from '@apollo/client';
import { getBugs } from 'src/GraphQL/Queries';
import string from 'string-sanitizer';

const BugList = () => {
  const { data, loading, error, refetch } = useQuery(getBugs);
  const [newData, setNewData] = useState(null);
  const [search, setSearch] = useState('');

  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (!loading) {
      setNewData(data.bugs.map((dataItem) => dataItem));
    }

    if (!loading && search) {
      if (search !== '') {
        const regex = new RegExp(string.sanitize.keepSpace(search), 'gi');
        setNewData((selectData) =>
          selectData.filter((bug) => bug.title.match(regex))
        );
      }

      if (search === '') {
        setNewData(data.bugs.map((dataItem) => dataItem));
      }
    }
  }, [data, search]);

  return (
    <>
      <Helmet>
        <title>Bugs | Jyngles</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <BugListToolbar handleCategorySearch={handleSearch} />
          <Box sx={{ pt: 3 }}>
            {newData === null ? (
              <LoadingSpinner />
            ) : (
              <BugListResults customers={newData} refetch={refetch} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BugList;
