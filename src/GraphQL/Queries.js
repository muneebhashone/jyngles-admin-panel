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
  query categories {
    categories {
      name
      _id
      icon
      is_active
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
