/* eslint-disable */
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Modal,
  Grid
  // Input,
  // FormControl,
  // InputLabel
} from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  CloudinaryUploadPreset,
  CloudinaryUploadUrl
} from 'src/components/config/config';
import { useNavigate } from 'react-router';
import { Search as SearchIcon } from 'react-feather';
import { createCategory as CREATE_CATEGORY } from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '30%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(3, 4, 3),
    borderRadius: 8
  },
  modalRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const CategoriesListToolbar = (props) => {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState('');
  const [categoryName, setCategoryName] = useState('');
  // eslint-disable-next-line operator-linebreak
  const [createCategory, { data, loading, error }] =
    useMutation(CREATE_CATEGORY);
  const navigate = useNavigate();
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (icon === '') {
      alert('Please upload icon');
      return;
    }
    if (categoryName === '') {
      alert('Category is required');
      return;
    }
    const uploadToCloudinary = async () => {
      const formData = new FormData();
      formData.append('file', icon[0]);
      formData.append('upload_preset', CloudinaryUploadPreset);
      const response = await axios.post(CloudinaryUploadUrl, formData);
      console.log(response.data.url);
      const responseCreate = await createCategory({
        variables: { name: categoryName, icon: response.data.url }
      });
      navigate('/app/categories', { replace: true });
    };
    uploadToCloudinary();
    if (loading) {
      console.log('Submitting...');
    }
    if (error) {
      console.log('Error occured');
    }
    if (data) {
      console.log(data);
    }
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button color="primary" variant="contained" onClick={handleOpen}>
          Add Category
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          classes={{ root: classes.modalRoot }}
        >
          <div className={classes.paper}>
            <form
              onSubmit={(event) => handleSubmit(event)}
              className={classes.root}
              noValidate
              autoComplete="off"
            >
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <Button
                    style={{ height: '50px' }}
                    fullWidth
                    variant="outlined"
                    component="label"
                  >
                    {icon ? 'Selected' : 'Upload Icon'}
                    <input
                      onChange={(event) => setIcon(event.target.files)}
                      encType="multipart/form-data"
                      type="file"
                      id="upload-icon"
                      multiple={false}
                      name="category-icon"
                      accept="image/png, image/jpeg"
                      hidden
                    />
                  </Button>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    onChange={(event) => setCategoryName(event.target.value)}
                    fullWidth
                    name="category-name"
                    label="Category Name"
                  />
                </Grid>
                <Grid item md={12}>
                  <Button
                    type="submit"
                    style={{ height: '50px' }}
                    fullWidth
                    variant="contained"
                  >
                    Add Category
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Modal>
      </Box>
      {/* <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
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
      </Box> */}
    </Box>
  );
};

export default CategoriesListToolbar;
