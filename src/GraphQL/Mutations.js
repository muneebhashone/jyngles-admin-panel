import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const createCategory = gql`
  mutation createCategory($name: String!, $icon: String) {
    createCategory(categoryInput: { name: $name, icon: $icon }) {
      name
      icon
    }
  }
`;

export const editCategory = gql`
  mutation editCategory(
    $id: String!
    $name: String!
    $icon: String!
    $is_active: Boolean
  ) {
    editCategory(
      editCategoryInput: {
        id: $id
        name: $name
        icon: $icon
        is_active: $is_active
      }
    ) {
      _id
      name
      icon
      is_active
    }
  }
`;

export const deleteCategory = gql`
  mutation deleteCategory($id: String!) {
    deleteCategory(id: $id) {
      _id
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
