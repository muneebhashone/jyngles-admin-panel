/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField } from '@material-ui/core';
import {
  getCategory as GET_CATEGORY,
  getAllCategories as GET_ALL_CATEGORIES
} from 'src/GraphQL/Queries';
import { createSubCategory as CREATE_SUB_CATEGORY } from 'src/GraphQL/Mutations';
import { useMutation, useQuery } from '@apollo/client';
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

function AddSubCategoryForm({ refetchQuery, onSuccess }) {
  const [icon, setIcon] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryParent, setCategoryParent] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [selectMenuItems, setSelectMenuItems] = useState([]);
  const [createSubCategory, { data, loading, error }] =
    useMutation(CREATE_SUB_CATEGORY);
  const {
    data: parentCategoryData,
    loading: parentCategoryLoading,
    error: parentCategoryError
  } = useQuery(GET_CATEGORY, { pollInterval: 500 });

  useEffect(() => {
    console.log(parentCategoryData);
    if (!parentCategoryLoading) {
      setSelectMenuItems(
        parentCategoryData.categories.map((parentCat) => ({
          label: parentCat.name,
          value: parentCat._id
        }))
      );
    }

    if (parentCategoryError) {
      console.log(parentCategoryError);
    }
  }, [parentCategoryData]);

  const formValidation = () => {
    if (icon === null) {
      alert('Please upload icon');
      return false;
    }
    if (categoryName === '') {
      alert('Category Name is required');
      return false;
    }

    if (categoryParent === '') {
      alert('Parent category is required');
      return false;
    }

    if (categoryType === '') {
      alert('Category type is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!formValidation()) return;

      const iconUrl = await uploadToCloudinary(icon[0]);

      const responseCreate = await createSubCategory({
        variables: {
          name: categoryName,
          icon: iconUrl,
          type: categoryType,
          parent_cat_id: categoryParent
        }
      });

      if (responseCreate.data.createSubCategory.name) {
        // setIcon(null);
        setCategoryName('');
        // setCategoryType('');
        // setCategoryParent('');
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
              {icon !== null ? 'Selected' : 'Upload Icon'}
              <input
                defaultValue={icon}
                onChange={(event) => {
                  setIcon(event.target.files);
                  console.log(event.target.files);
                }}
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
            <SelectComponent
              inputLabel="Parent"
              handleOnSelect={(value) => setCategoryParent(value)}
              value={categoryParent}
              menuItems={selectMenuItems}
            />
          </Grid>
          <Grid item md={12}>
            <Button
              type="submit"
              style={{ height: '50px' }}
              fullWidth
              variant="contained"
            >
              Add Sub Category
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddSubCategoryForm;
