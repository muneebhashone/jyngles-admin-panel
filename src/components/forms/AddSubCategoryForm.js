/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import { useParams } from 'react-router';
import {
  getCategory as GET_CATEGORY,
  getAllCategories as GET_ALL_CATEGORIES
} from 'src/GraphQL/Queries';
import { createSubCategory as CREATE_SUB_CATEGORY } from 'src/GraphQL/Mutations';
import { useMutation, useQuery } from '@apollo/client';
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
    width: '70%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(3, 4, 3),
    borderRadius: 8
  }
}));

const AddSubCategorySchema = Yup.object().shape({
  icon: Yup.string().required('Icon is required'),
  subCategoryNameEn: Yup.string().required(
    'Sub Category Name (English) is required'
  ),
  subCategoryType: Yup.string().required('Please choose category type'),
  subCategoryParent: Yup.string().required('Subcategory must have a parent'),
  color: Yup.string().required('Category color is required')
});

function AddSubCategoryForm({ refetchQuery, onSuccess }) {
  const [selectMenuItems, setSelectMenuItems] = useState([]);
  const params = useParams();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      icon: '',
      subCategoryNameEn: '',
      subCategoryNameAr: '',
      subCategoryNameBn: '',
      subCategoryNameDe: '',
      subCategoryNameEs: '',
      subCategoryNameFf: '',
      subCategoryNameFr: '',
      subCategoryNameHi: '',
      subCategoryNameIdd: '',
      subCategoryNameIt: '',
      subCategoryNamePp: '',
      subCategoryNameRu: '',
      subCategoryNameUr: '',
      subCategoryNameMd: '',
      subCategoryParent: '',
      subCategoryType: '',
      color: '#000000'
    },
    validationSchema: AddSubCategorySchema,
    onSubmit: (values) => {
      handleSubmit(values);
      console.log(values);
    }
  });

  const [createSubCategory, { data, loading, error }] =
    useMutation(CREATE_SUB_CATEGORY);
  const {
    data: parentCategoryData,
    loading: parentCategoryLoading,
    error: parentCategoryError
  } = useQuery(GET_ALL_CATEGORIES, { pollInterval: 500 });

  const handleIconChange = (files) => {
    if (!files) return;
    formik.setFieldValue('icon', files[0]);
  };

  useEffect(() => {
    if (params.id) {
      formik.setFieldValue('subCategoryParent', params.id);
    }
  }, []);

  useEffect(() => {
    if (!parentCategoryLoading) {
      setSelectMenuItems(
        parentCategoryData.getAllCategories.map((parentCat) => ({
          label: parentCat.name,
          value: parentCat._id
        }))
      );
    }

    if (parentCategoryError) {
      console.log(parentCategoryError);
    }
  }, [parentCategoryData]);

  const handleSubmit = async (values) => {
    try {
      const iconUrl = await uploadToCloudinary(values.icon);

      const responseCreate = await createSubCategory({
        variables: {
          name: values.subCategoryNameEn,
          icon: iconUrl,
          type: values.subCategoryType,
          color: values.color,
          parent_cat_id: values.subCategoryParent,
          ar: values.subCategoryNameAr,
          en: values.subCategoryNameEn,
          bn: values.subCategoryNameBn,
          de: values.subCategoryNameDe,
          es: values.subCategoryNameEs,
          ff: values.subCategoryNameFf,
          fr: values.subCategoryNameFr,
          hi: values.subCategoryNameHi,
          idd: values.subCategoryNameIdd,
          it: values.subCategoryNameIt,
          pp: values.subCategoryNamePp,
          ru: values.subCategoryNameRu,
          ur: values.subCategoryNameUr,
          md: values.subCategoryNameMd
        }
      });

      if (responseCreate.data.createSubCategory.name) {
        formik.resetForm();
        onSuccess();
        refetchQuery();
      }

      if (loading) {
        console.log('Submitting...');
      }
      if (error) {
        console.log('Error occured');
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
          <Grid item md={4}>
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
          <Grid item md={4}>
            <TextField
              error={
                formik.errors.subCategoryNameEn &&
                formik.touched.subCategoryNameEn
                  ? true
                  : false
              }
              onChange={formik.handleChange}
              name="subCategoryNameEn"
              id="subCategoryNameEn"
              value={formik.values.subCategoryNameEn}
              fullWidth
              label="Category Name"
            />
          </Grid>
          <Grid item md={4}>
            <SelectComponent
              error={
                formik.errors.subCategoryType && formik.touched.subCategoryType
                  ? true
                  : false
              }
              inputLabel="Type"
              name="subCategoryType"
              id="subCategoryType"
              onChange={formik.handleChange}
              value={formik.values.subCategoryType}
            />
          </Grid>
          <Grid item md={6}>
            <input
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
              name="color"
              id="color"
              onChange={formik.handleChange}
            ></input>
          </Grid>
          <Grid item md={6}>
            <SelectComponent
              error={
                formik.errors.subCategoryParent &&
                formik.touched.subCategoryParent
                  ? true
                  : false
              }
              inputLabel="Parent"
              onChange={formik.handleChange}
              value={formik.values.subCategoryParent}
              name="subCategoryParent"
              id="subCategoryParent"
              menuItems={selectMenuItems}
            />
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
              value={formik.values.subCategoryNameAr}
              fullWidth
              name="subCategoryNameAr"
              label="Arabic"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameFr}
              fullWidth
              name="subCategoryNameFr"
              label="French"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameBn}
              fullWidth
              name="subCategoryNameBn"
              label="Bangla/Bengali"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameDe}
              fullWidth
              name="subCategoryNameDe"
              label="German"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameEs}
              fullWidth
              name="subCategoryNameEs"
              label="Spanish"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameFf}
              fullWidth
              name="subCategoryNameFf"
              label="Fulani/Fula"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameHi}
              fullWidth
              name="subCategoryNameHi"
              label="Hindi"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameIdd}
              fullWidth
              name="subCategoryNameIdd"
              label="Indonesian"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameIt}
              fullWidth
              name="subCategoryNameIt"
              label="Italian"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameMd}
              fullWidth
              name="subCategoryNameMd"
              label="Mandarin Chinese"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNamePp}
              fullWidth
              name="subCategoryNamePp"
              label="Portuguese"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameRu}
              fullWidth
              name="subCategoryNameRu"
              label="Russian"
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              onChange={formik.handleChange}
              value={formik.values.subCategoryNameUr}
              fullWidth
              name="subCategoryNameUr"
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
              Add Sub Category
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddSubCategoryForm;
