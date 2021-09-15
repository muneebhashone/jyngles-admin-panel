import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const createCategory = gql`
  mutation createCategory(
    $name: String!
    $icon: String
    $type: String
    $color: String!
    $sub_cats: [String]!
  ) {
    createCategory(
      categoryInput: {
        name: $name
        icon: $icon
        type: $type
        color: $color
        sub_cats: $sub_cats
      }
    ) {
      name
      icon
      type
      _id
      subCats {
        _id
        name
      }
    }
  }
`;

export const editCategory = gql`
  mutation editCategory(
    $id: String!
    $name: String!
    $icon: String!
    $is_active: Boolean
    $type: String
    $color: String!
  ) {
    editCategory(
      editCategoryInput: {
        id: $id
        name: $name
        icon: $icon
        is_active: $is_active
        type: $type
        color: $color
      }
    ) {
      _id
      name
      icon
      is_active
      type
      color
    }
  }
`;

export const deleteCategory = gql`
  mutation deleteCategory($id: String!) {
    deleteCategory(deleteCategoryInput: { id: $id }) {
      _id
      name
    }
  }
`;

export const LoginUser = gql`
  mutation Login(
    $facebookId: String
    $email: String
    $password: String
    $type: String!
    $appleId: String
    $name: String
    $notificationToken: String
  ) {
    login(
      facebookId: $facebookId
      email: $email
      password: $password
      type: $type
      appleId: $appleId
      name: $name
      notificationToken: $notificationToken
    ) {
      userId
      token
      tokenExpiration
      name
      email
      phone
    }
  }
`;

export const editUserStatus = gql`
  mutation editUserStatus($email: String!) {
    editUserStatus(updateUserStatus: { email: $email }) {
      result
    }
  }
`;

export const createUser = gql`
  mutation CreateUser(
    $facebookId: String
    $phone: String
    $email: String
    $password: String
    $name: String
    $notificationToken: String
    $appleId: String
  ) {
    createUser(
      userInput: {
        facebookId: $facebookId
        phone: $phone
        email: $email
        password: $password
        name: $name
        notificationToken: $notificationToken
        appleId: $appleId
      }
    ) {
      userId
      token
      tokenExpiration
      name
      email
      phone
      notificationToken
    }
  }
`;

export const adminLogin = gql`
  mutation adminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      email
      userId
      name
      token
    }
  }
`;

export const createSubCategory = gql`
  mutation createSubCategory(
    $name: String!
    $icon: String
    $type: String
    $parent_cat_id: String!
    $color: String!
  ) {
    createSubCategory(
      subCategoryInput: {
        name: $name
        icon: $icon
        type: $type
        parent_cat_id: $parent_cat_id
        color: $color
      }
    ) {
      _id
      name
      icon
      is_active
      subCats {
        _id
        name
      }
    }
  }
`;

export const editSubCategory = gql`
  mutation editSubCategory(
    $id: String!
    $name: String!
    $icon: String
    $type: String
    $parent_cat_id: String!
    $color: String!
  ) {
    editSubCategory(
      editSubCategoryInput: {
        id: $id
        name: $name
        icon: $icon
        type: $type
        parent_cat_id: $parent_cat_id
        color: $color
      }
    ) {
      _id
      name
      icon
      is_active
      subCats {
        _id
        name
        color
      }
    }
  }
`;

export const deleteSubCategory = gql`
  mutation deleteSubCategory($id: String!) {
    deleteSubCategory(deleteSubCategoryInput: { id: $id }) {
      _id
      name
    }
  }
`;
