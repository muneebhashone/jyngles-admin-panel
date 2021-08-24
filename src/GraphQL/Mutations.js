import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const createCategory = gql`
    mutation createCategory($name: String!, $icon: String) {
        createCategory(categoryInput:{name: $name, icon: $icon}) 
        {
            name
            icon
        }
    }
`;

export const editCategory = gql`
    mutation editCategory($_id: ID!, $name: String, $icon: String) {
        editCategory(categoryInput:{name: $name, icon: $icon}) 
        {
            _id
            name
            icon
        }
    }
`;

export const deleteCategory = gql`
    mutation deleteCategory($id: String!) {
        deleteCategory(id: $id)
        {
            id
        }
    }
`;
