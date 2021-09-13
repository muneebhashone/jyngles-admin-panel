/* eslint-disable */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField } from '@material-ui/core';
import { createCategory as CREATE_CATEGORY } from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import SelectComponent from '../select/SelectComponent';
import uploadToCloudinary from '../../utils/uploadToCloudinary';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize'
  },
  paper: {
    position: 'absolute',
    width: '30%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(3, 4, 3),
    borderRadius: 8
  }
}));

function AddCategoryForm({ refetchQuery, onSuccess }) {
  const [icon, setIcon] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [createCategory, { data, loading, error }] =
    useMutation(CREATE_CATEGORY);

  const formValidation = () => {
    if (icon === '') {
      alert('Please upload icon');
      return false;
    }
    if (categoryName === '') {
      alert('Category Name is required');
      return false;
    }

    if (categoryType === '') {
      alert('Category Type is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!formValidation()) return;

      const iconUrl = await uploadToCloudinary(icon[0]);

      const responseCreate = await createCategory({
        variables: {
          name: categoryName,
          icon: iconUrl,
          type: categoryType,
          sub_cats: []
        }
      });

      if (responseCreate.data.createCategory.name) {
        setIcon('');
        setCategoryName('');
        onSuccess();
        refetchQuery();
      }

      if (loading) {
        console.log('Submitting...');
      }
      if (error) {
        console.log('Error occured');
      }
      if (data) {
        console.log(data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const classes = useStyles();

  return (
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
              value={categoryName}
              fullWidth
              name="category-name"
              label="Category Name"
            />
          </Grid>
          <Grid item md={12}>
            <SelectComponent
              inputLabel="Type"
              handleOnSelect={(value) => setCategoryType(value)}
              value={categoryType}
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
  );
}

export default AddCategoryForm;
