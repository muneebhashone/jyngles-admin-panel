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
// import Alert from 'src/components/alert/Alert';
import uploadToCloudinary from 'src/utils/uploadToCloudinary';
import {
  editSubCategory as EDIT_SUB_CATEGORY,
  deleteSubCategory as DELETE_SUB_CATEGORY
} from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
// import ColorPicker from 'material-ui-color-picker';
import { MaterialPicker } from 'react-color';
import { ChromePicker } from 'react-color';

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
  },
  modalRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const SubCategoriesListResults = ({ customers, refetchQuery, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showColor, setShowColor] = useState();
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const params = useParams();
  const [editCat, setEditCat] = useState({
    id: null,
    name: null,
    icon: null,
    type: null,
    color: null
  });
  const [updateIcon, setUpdateIcon] = useState(false);
  const [editSubCategory, { data, loading, error }] =
    useMutation(EDIT_SUB_CATEGORY);
  const [
    deleteSubCategory,
    { data: deleteData, loading: deleteLoading, error: deleteError }
  ] = useMutation(DELETE_SUB_CATEGORY);
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
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
    const { _id: id, name, icon, type, color } = customer;
    setEditCat({ id, name, icon, type, color });
    setModalOpen(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (editCat.name === '' || editCat.name === null) {
      alert('Category name should not be empty');
      return;
    }

    if (!updateIcon) {
      const updateCategoryWithoutIcon = async () => {
        try {
          const response = await editSubCategory({
            variables: {
              id: String(editCat.id),
              name: editCat.name,
              icon: editCat.icon,
              type: editCat.type,
              color: editCat.color || '#000000',
              parent_cat_id: params.id
            }
          });
          notify();
          refetchQuery();
        } catch (err) {
          console.log(err);
        }
      };
      updateCategoryWithoutIcon();
    }

    if (updateIcon) {
      const updateCategoryWithIcon = async () => {
        try {
          const uploadLink = await uploadToCloudinary(editCat.icon);

          const resp = await editSubCategory({
            variables: {
              id: String(editCat.id),
              name: editCat.name,
              icon: uploadLink,
              type: editCat.type,
              color: editCat.color || '#000000',
              parent_cat_id: params.id
            }
          });
          notify();
          refetchQuery();
        } catch (err) {
          console.log(err);
        }
      };
      updateCategoryWithIcon();
    }
  };

  const handleSelectType = (value) => {
    setEditCat({ ...editCat, type: value });
  };

  const handleCategoryStatus = (category) => {
    const updateCategoryStatus = async () => {
      try {
        const response = await deleteSubCategory({
          variables: {
            id: category._id
          }
        });
        refetchQuery();
      } catch (err) {
        console.log(err);
      }
    };
    updateCategoryStatus();
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
                onSubmit={(event) => handleEditSubmit(event)}
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
                      {updateIcon ? 'Selected' : 'Update Icon'}
                      <input
                        onChange={(e) => {
                          setEditCat({
                            ...editCat,
                            icon: e.target.files[0]
                          });
                          setUpdateIcon(true);
                        }}
                        encType="multipart/form-data"
                        type="file"
                        id="update-upload-icon"
                        multiple={false}
                        name="category-icon"
                        accept="image/png, image/jpeg"
                        hidden
                      />
                    </Button>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      onChange={(e) =>
                        setEditCat({
                          ...editCat,
                          name: e.target.value
                        })
                      }
                      value={editCat.name}
                      fullWidth
                      name="update-category-name"
                      label="Category Name"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <SelectComponent
                      inputLabel="Type"
                      handleOnSelect={handleSelectType}
                      value={editCat.type}
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
                      defaultValue={editCat.color || '#000000'}
                      onChange={(event) =>
                        setEditCat({ ...editCat, color: event.target.value })
                      }
                    ></input>
                  </Grid>
                  <Grid item md={12}>
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

export default SubCategoriesListResults;
