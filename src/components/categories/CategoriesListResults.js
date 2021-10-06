/* eslint-disable */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Grid,
  Button,
  TextField,
  Modal
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SelectComponent from '../select/SelectComponent';
import EditIcon from '@material-ui/icons/Edit';
import getInitials from 'src/utils/getInitials';
import uploadToCloudinary from 'src/utils/uploadToCloudinary';
import {
  editCategory as EDIT_CATEGORY,
  editCategoryStatus as EDIT_CATEGORY_STATUS
} from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
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
  },
  modalRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const EditCategorySchema = Yup.object().shape({
  icon: Yup.string().required('Icon is required'),
  categoryNameEn: Yup.string().required('Category Name (English) is required'),
  categoryType: Yup.string().required('Please choose Category type'),
  color: Yup.string().required('Category color is required')
});

const CategoriesListResults = ({ customers, refetchQuery, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const [updateIcon, setUpdateIcon] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: '',
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
    validationSchema: EditCategorySchema,
    onSubmit: (values) => {
      console.log(values);
      handleEditSubmit(values);
    }
  });

  const [
    editCategory,
    { loading: editCategoryLoading, error: editCategoryError }
  ] = useMutation(EDIT_CATEGORY);
  const [
    editCategoryStatus,
    { loading: editCategoryStatusLoading, error: editCategoryStatusError }
  ] = useMutation(EDIT_CATEGORY_STATUS);

  const handleIconChange = (files) => {
    if (!files) return;
    formik.setFieldValue('icon', files[0]);
    setUpdateIcon(true);
  };

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const notify = () =>
    toast(`Category Updated`, {
      style: {
        backgroundColor: '#78CA42',
        color: 'white'
      },
      hideProgressBar: true
    });

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer._id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(1)
      );
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    if (newPage === 0) {
      setStartPoint(newPage);
      setEndPoint(limit);
    }

    if (newPage >= 1) {
      const startPointNum = newPage * limit;
      setStartPoint(startPointNum);
      setEndPoint(startPointNum + limit);
    }
  };

  const handleEdit = (customer) => {
    formik.setFieldValue('id', customer._id);
    formik.setFieldValue('categoryNameEn', customer.name);
    formik.setFieldValue('icon', customer.icon);
    formik.setFieldValue('categoryType', customer.type);
    formik.setFieldValue('color', customer.color);
    formik.setFieldValue('categoryNameAr', customer.ar);
    formik.setFieldValue('categoryNameBn', customer.bn);
    formik.setFieldValue('categoryNameDe', customer.de);
    formik.setFieldValue('categoryNameEs', customer.es);
    formik.setFieldValue('categoryNameFf', customer.ff);
    formik.setFieldValue('categoryNameFr', customer.fr);
    formik.setFieldValue('categoryNameHi', customer.hi);
    formik.setFieldValue('categoryNameIt', customer.it);
    formik.setFieldValue('categoryNameMd', customer.md);
    formik.setFieldValue('categoryNameIdd', customer.idd);
    formik.setFieldValue('categoryNamePp', customer.pp);
    formik.setFieldValue('categoryNameRu', customer.ru);
    formik.setFieldValue('categoryNameUr', customer.ur);

    setModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      let categoryIcon = values.icon;

      if (updateIcon) {
        categoryIcon = await uploadToCloudinary(values.icon);
      }

      const resp = await editCategory({
        variables: {
          id: values.id,
          name: values.categoryNameEn,
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
          md: values.categoryNameMd,
          icon: categoryIcon,
          type: values.categoryType,
          color: values.color || '#000000'
        }
      });

      if (resp.data.editCategory.name) {
        notify();
        refetchQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryStatus = async (category) => {
    try {
      const resp = await editCategoryStatus({
        variables: {
          id: category._id,
          is_active: !category.is_active
        }
      });

      refetchQuery();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setEndPoint(limit);
  }, [limit]);

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Status</TableCell>
                <TableCell style={{ textAlign: 'right' }}>Edit</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.slice(startPoint, endPoint).map((customer) => (
                <TableRow
                  hover
                  key={customer._id}
                  selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer._id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/categories/${customer._id}`}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Avatar src={customer.icon} sx={{ mr: 2 }}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography
                          classes={{ root: classes.title }}
                          color="textPrimary"
                          variant="body1"
                        >
                          {customer.name}
                        </Typography>
                      </Box>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        classes={{ root: classes.title }}
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.type ? customer.type : 'No Type'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: customer.color || '#000000',
                          width: '100%',
                          height: '50px'
                        }}
                      ></div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {customer.is_active ? 'Active' : 'Disabled'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      onClick={() => handleEdit(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleCategoryStatus(customer)}>
                      {customer.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Modal
            open={modalOpen}
            onClose={handleClose}
            classes={{ root: classes.modalRoot }}
          >
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
                      color={
                        formik.errors.icon && formik.touched.icon
                          ? 'error'
                          : 'primary'
                      }
                      style={{ height: '50px' }}
                      fullWidth
                      variant="outlined"
                      component="label"
                    >
                      {!updateIcon ? 'Update Icon' : 'Selected'}
                      <input
                        onChange={(event) =>
                          handleIconChange(event.target.files)
                        }
                        encType="multipart/form-data"
                        type="file"
                        id="icon"
                        multiple={false}
                        name="icon"
                        accept="image/png, image/jpeg"
                        hidden
                      />
                    </Button>
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      error={
                        formik.errors.categoryNameEn &&
                        formik.touched.categoryNameEn
                          ? true
                          : false
                      }
                      onChange={formik.handleChange}
                      value={formik.values.categoryNameEn}
                      fullWidth
                      name="categoryNameEn"
                      label="Category Name (En)"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <SelectComponent
                      error={
                        formik.errors.categoryType &&
                        formik.touched.categoryType
                          ? true
                          : false
                      }
                      inputLabel="Type"
                      onChange={formik.handleChange}
                      value={formik.values.categoryType}
                      name="categoryType"
                    />
                  </Grid>
                  <Grid item md={3}>
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
                      onChange={formik.handleChange}
                      name="color"
                      id="color"
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
                      Update Category
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Modal>
          <ToastContainer />
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CategoriesListResults.propTypes = {
  customers: PropTypes.array.isRequired
};

export default CategoriesListResults;
