import { gql } from '@apollo/client';

export const myGoals = gql`
  query {
    myGoals {
      _id
      title
      amount
      description
      achieve_date
      status
      category {
        icon
        name
        _id
      }
    }
  }
`;

export const getCategory = gql`
  query ($type: String) {
    categories(type: $type) {
      _id
      name
      icon
      type
      is_active
      color
      subCats {
        _id
        name
        type
        icon
        color
      }
    }
  }
`;

export const getAllCategories = gql`
  query {
    getAllCategories {
      _id
      name
      icon
      is_active
      type
      color
      subCats {
        _id
        name
        icon
        type
        is_active
        color
      }
    }
  }
`;

export const getAllUsers = gql`
  query {
    getAllUsers {
      _id
      name
      last_name
      phone
      email
      createdAt
      is_active
    }
  }
`;
