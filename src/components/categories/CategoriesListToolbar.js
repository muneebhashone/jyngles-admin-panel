/* eslint-disable */
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Modal,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import AddCategoryForm from '../forms/AddCategoryForm';
import AddSubCategoryForm from '../forms/AddSubCategoryForm';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const CategoriesListToolbar = (props) => {
  const { refetch, handleCategorySearch, hideSearch } = props;
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const classes = useStyles();
  const notify = (categoryType) =>
    toast(`${categoryType} Added`, {
      style: {
        backgroundColor: '#78CA42',
        color: 'white'
      },
      hideProgressBar: true
    });

  const handleOpen = (formType) => {
    setFormType(formType);
    setOpen(true);
  };

  const handleClose = () => {
    setFormType(null);
    setOpen(false);
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          style={{ marginRight: '15px' }}
          color="primary"
          variant="contained"
          onClick={() => handleOpen('parent')}
        >
          Add Category
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleOpen('sub')}
        >
          Add Sub Category
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          classes={{ root: classes.modalRoot }}
        >
          <>
            {formType === 'sub' && (
              <AddSubCategoryForm
                refetchQuery={refetch}
                onSuccess={() => notify('Sub Category')}
              />
            )}
            {formType === 'parent' && (
              <AddCategoryForm
                refetchQuery={refetch}
                onSuccess={() => notify('Category')}
              />
            )}
          </>
        </Modal>
      </Box>
      {!hideSearch && (
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  onChange={(event) => handleCategorySearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search Category"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};

export default CategoriesListToolbar;
