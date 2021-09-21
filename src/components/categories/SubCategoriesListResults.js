/* eslint-disable */

import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useParams } from 'react-router-dom';
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
  editSubCategory as EDIT_SUB_CATEGORY,
  deleteSubCategory as DELETE_SUB_CATEGORY
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

const EditSubCategorySchema = Yup.object().shape({
  icon: Yup.string().required('Icon is required'),
  subCategoryNameEn: Yup.string().required(
    'Sub Category Name (English) is required'
  ),
  subCategoryType: Yup.string().required('Please choose Subcategory type'),
  color: Yup.string().required('Category color is required')
});

const SubCategoriesListResults = ({ customers, refetchQuery, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const params = useParams();

  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [updateIcon, setUpdateIcon] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: '',
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
      subCategoryType: '',
      color: '#000000'
    },
    validationSchema: EditSubCategorySchema,
    onSubmit: (values) => {
      handleEditSubmit(values);
    }
  });

  const [editSubCategory, { data, loading, error }] =
    useMutation(EDIT_SUB_CATEGORY);
  const [
    deleteSubCategory,
    { data: deleteData, loading: deleteLoading, error: deleteError }
  ] = useMutation(DELETE_SUB_CATEGORY);

  const notify = () =>
    toast(`Category Updated`, {
      style: {
        backgroundColor: '#78CA42',
        color: 'white'
      },
      hideProgressBar: true
    });

  const handleIconChange = (files) => {
    if (!files) return;
    formik.setFieldValue('icon', files[0]);
    setUpdateIcon(true);
  };

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
    formik.setFieldValue('subCategoryNameEn', customer.name);
    formik.setFieldValue('icon', customer.icon);
    formik.setFieldValue('subCategoryType', customer.type);
    formik.setFieldValue('color', customer.color);
    formik.setFieldValue('subCategoryNameAr', customer.ar);
    formik.setFieldValue('subCategoryNameBn', customer.bn);
    formik.setFieldValue('subCategoryNameDe', customer.de);
    formik.setFieldValue('subCategoryNameEs', customer.es);
    formik.setFieldValue('subCategoryNameFf', customer.ff);
    formik.setFieldValue('subCategoryNameFr', customer.fr);
    formik.setFieldValue('subCategoryNameHi', customer.hi);
    formik.setFieldValue('subCategoryNameIt', customer.it);
    formik.setFieldValue('subCategoryNameMd', customer.md);
    formik.setFieldValue('subCategoryNameIdd', customer.idd);
    formik.setFieldValue('subCategoryNamePp', customer.pp);
    formik.setFieldValue('subCategoryNameRu', customer.ru);
    formik.setFieldValue('subCategoryNameUr', customer.ur);

    setModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      let subCategoryIcon = values.icon;

      if (updateIcon) {
        subCategoryIcon = await uploadToCloudinary(values.icon);
      }

      const resp = await editSubCategory({
        variables: {
          id: values.id,
          name: values.subCategoryNameEn,
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
          md: values.subCategoryNameMd,
          icon: subCategoryIcon,
          type: values.subCategoryType,
          color: values.color,
          parent_cat_id: params.id
        }
      });

      if (resp.data.editSubCategory.subCats) {
        notify();
        refetchQuery();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryStatus = async (category) => {
    try {
      await deleteSubCategory({
        variables: {
          id: category._id
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
                      Delete
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
                        formik.errors.subCategoryNameEn &&
                        formik.touched.subCategoryNameEn
                          ? true
                          : false
                      }
                      onChange={formik.handleChange}
                      value={formik.values.subCategoryNameEn}
                      fullWidth
                      name="subCategoryNameEn"
                      label="Category Name (En)"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <SelectComponent
                      error={
                        formik.errors.subCategoryType &&
                        formik.touched.subCategoryType
                          ? true
                          : false
                      }
                      inputLabel="Type"
                      onChange={formik.handleChange}
                      value={formik.values.subCategoryType}
                      name="subCategoryType"
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
                      Update Sub Category
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

export default SubCategoriesListResults;
