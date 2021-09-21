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

export const getBugs = gql`
  query {
    bugs {
      _id
      title
      description
      user {
        _id
        name
        last_name
        email
        phone
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
      ar
      bn
      de
      en
      es
      ff
      fr
      hi
      it
      pp
      ru
      ur
      md
      idd
      subCats {
        _id
        name
        type
        icon
        color
        ar
        bn
        de
        en
        es
        ff
        fr
        hi
        it
        pp
        ru
        ur
        md
        idd
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
      ar
      bn
      de
      en
      es
      ff
      fr
      hi
      it
      pp
      ru
      ur
      md
      idd
      subCats {
        _id
        name
        icon
        type
        is_active
        color
        ar
        bn
        de
        en
        es
        ff
        fr
        hi
        it
        pp
        ru
        ur
        md
        idd
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
