import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as serviceWorker from './serviceWorker';
import App from './App';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([
  errorLink,
  new HttpLink({ uri: 'https://myjyngles.com/graphql' })
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
), document.getElementById('root'));

serviceWorker.unregister();
