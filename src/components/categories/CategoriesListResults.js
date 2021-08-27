/* eslint-disable */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import getInitials from 'src/utils/getInitials';
// import Alert from 'src/components/alert/Alert';
import { editCategory as EDIT_CATEGORY } from 'src/GraphQL/Mutations';
import { useMutation } from '@apollo/client';
import axios from 'axios';
import {
  CloudinaryUploadUrl,
  CloudinaryUploadPreset
} from 'src/components/config/config';

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

const CategoriesListResults = ({ customers, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [startPoint, setStartPoint] = useState(0);
  const [endPoint, setEndPoint] = useState(0);
  const [editCat, setEditCat] = useState({
    id: null,
    name: null,
    icon: null
  });
  const [updateIcon, setUpdateIcon] = useState(false);
  const [editCategory, { data, loading, error }] = useMutation(EDIT_CATEGORY);
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  // const [catDelete, setCatDelete] = useState(null);
  // const [deleteCategory, { data, loading, error }] =
  //   useMutation(DELETE_CATEGORY);

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

    console.log('endPoint:', endPoint);
    console.log('startPoint:', startPoint);
  };

  // const handleDelete = (id) => {
  //   setAlert(true);
  //   setCatDelete(id);
  // };

  const handleEdit = (id, name, icon) => {
    setEditCat({ id, name, icon });
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
        const response = await editCategory({
          variables: {
            id: String(editCat.id),
            name: editCat.name,
            icon: editCat.icon,
            is_active: true
          }
        });
        console.log(response);
      };
      updateCategoryWithoutIcon();
    }

    if (updateIcon) {
      const updateCategoryWithIcon = async () => {
        const formData = new FormData();
        formData.append('file', editCat.icon);
        formData.append('upload_preset', CloudinaryUploadPreset);
        const response = await axios.post(CloudinaryUploadUrl, formData);
        console.log('Image Url:', response.data.url);
        const resp = await editCategory({
          variables: {
            id: String(editCat.id),
            name: editCat.name,
            icon: response.data.url,
            is_active: true
          }
        });
        console.log('GraphQL Response:', resp);
      };
      updateCategoryWithIcon();
    }
  };

  const handleCategoryStatus = (id, name, icon, isActive) => {
    const updateCategoryStatus = async () => {
      const response = await editCategory({
        variables: {
          id: id,
          name: name,
          icon: icon,
          is_active: !isActive
        }
      });
      console.log(response);
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
                      onClick={() =>
                        handleEdit(customer._id, customer.name, customer.icon)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleCategoryStatus(
                          customer._id,
                          customer.name,
                          customer.icon,
                          customer.is_active
                        )
                      }
                    >
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
