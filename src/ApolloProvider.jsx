import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';
import App from './App'

const httpLink = createHttpLink({
  uri: 'https://lit-gorge-47405.herokuapp.com/' || 'http://localhost:4000',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('jwtToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});



export default (
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
)