/* eslint-disable */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import { createCategory as CREATE_CATEGORY } from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import SelectComponent from '../select/SelectComponent';
import uploadToCloudinary from '../../utils/uploadToCloudinary';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize'
  },
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(3, 4, 3),
    borderRadius: 8
  }
}));

const AddCategorySchema = Yup.object().shape({
  icon: Yup.string().required('Icon is required'),
  categoryNameEn: Yup.string().required('Category Name (English) is required'),
  categoryType: Yup.string().required('Please choose category type'),
  color: Yup.string().required('Category color is required')
});

function AddCategoryForm({ refetchQuery, onSuccess }) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      icon: '',
      categoryNameEn: '',
      categoryNameAr: '',
      categoryNameBn: '',
      categoryNameDe: '',
      categoryNameEs: '',
      categoryNameFf: '',
      categoryNameFr: '',
      categoryNameHi: '',
      categoryNameIdd: '',
      categoryNameIt: '',
      categoryNamePp: '',
      categoryNameRu: '',
      categoryNameUr: '',
      categoryNameMd: '',
      categoryType: '',
      color: '#000000'
    },
    validationSchema: AddCategorySchema,
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });

  const handleIconChange = (files) => {
    if (!files) return;
    formik.setFieldValue('icon', files[0]);
  };

  const [createCategory, { data, loading, error }] =
    useMutation(CREATE_CATEGORY);

  const handleSubmit = async (values) => {
    try {
      const iconUrl = await uploadToCloudinary(values.icon);

      const responseCreate = await createCategory({
        variables: {
          name: values.categoryNameEn,
          icon: iconUrl,
          type: values.categoryType,
          color: values.color,
          sub_cats: [],
          ar: values.categoryNameAr,
          en: values.categoryNameEn,
          bn: values.categoryNameBn,
          de: values.categoryNameDe,
          es: values.categoryNameEs,
          ff: values.categoryNameFf,
          fr: values.categoryNameFr,
          hi: values.categoryNameHi,
          idd: values.categoryNameIdd,
          it: values.categoryNameIt,
          pp: values.categoryNamePp,
          ru: values.categoryNameRu,
          ur: values.categoryNameUr,
          md: values.categoryNameMd
        }
      });

      if (responseCreate.data.createCategory.name) {
        formik.resetForm();
        refetchQuery();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className={classes.paper}>
      <form
        onSubmit={formik.handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={2}>
          <Grid item md={3}>
            <Button
              style={{ height: '50px' }}
              fullWidth
              variant="outlined"
              color={
                formik.errors.icon && formik.touched.icon ? 'error' : 'primary'
              }
              component="label"
            >
              {formik.values.icon ? 'Selected' : 'Upload Icon'}
              <input
                onChange={(event) => handleIconChange(event.target.files)}
                name="icon"
                encType="multipart/form-data"
                type="file"
                id="upload-icon"
                multiple={false}
                accept="image/png, image/jpeg"
                hidden
              />
            </Button>
          </Grid>
          <Grid item md={3}>
            <TextField
              error={
                formik.errors.categoryNameEn && formik.touched.categoryNameEn
                  ? true
                  : false
              }
              id="categoryNameEn"
              name="categoryNameEn"
              onChange={formik.handleChange}
              value={formik.values.categoryNameEn}
              fullWidth
              label="Category Name"
              helperText=""
            />
          </Grid>
          <Grid item md={3}>
            <SelectComponent
              name="categoryType"
              inputLabel="Type"
              error={
                formik.errors.categoryType && formik.touched.categoryType
                  ? true
                  : false
              }
              onChange={formik.handleChange}
              value={formik.values.categoryType}
            />
          </Grid>
          <Grid item md={3}>
            <input
              name="color"
              type="color"
              style={{
                width: '100%',
                height: '100%',
                border: '2px solid #00000038',
                background: '#00000012',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
              defaultValue={formik.values.color}
              onChange={formik.handleChange}
            ></input>
          </Grid>
          <Grid item md={12}>
            <Typography variant="h4" align="center">
              {' '}
              LOCALIZATIONS{' '}
            </Typography>
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameAr}
              fullWidth
              name="categoryNameAr"
              label="Arabic"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameFr}
              fullWidth
              name="categoryNameFr"
              label="French"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameBn}
              fullWidth
              name="categoryNameBn"
              label="Bangla/Bengali"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameDe}
              fullWidth
              name="categoryNameDe"
              label="German"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameEs}
              fullWidth
              name="categoryNameEs"
              label="Spanish"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameFf}
              fullWidth
              name="categoryNameFf"
              label="Fulani/Fula"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameHi}
              fullWidth
              name="categoryNameHi"
              label="Hindi"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameIdd}
              fullWidth
              name="categoryNameIdd"
              label="Indonesian"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameIt}
              fullWidth
              name="categoryNameIt"
              label="Italian"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameMd}
              fullWidth
              name="categoryNameMd"
              label="Mandarin Chinese"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNamePp}
              fullWidth
              name="categoryNamePp"
              label="Portuguese"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameRu}
              fullWidth
              name="categoryNameRu"
              label="Russian"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.categoryNameUr}
              fullWidth
              name="categoryNameUr"
              label="Urdu"
            />
          </Grid>
          <Grid item md={9}>
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
