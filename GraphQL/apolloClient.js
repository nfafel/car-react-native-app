import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import store from '../redux/store'
   
const httpLink = createHttpLink({
    uri: 'https://tranquil-caverns-41069.herokuapp.com/graphql',
});
    
const wsLink = new WebSocketLink({
    uri: 'wss://tranquil-caverns-41069.herokuapp.com/graphql',
    options: {
        reconnect: true
    }
})

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = store.getState().token;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
    
const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
)

const client = new ApolloClient({ 
    link: authLink.concat(link),
    cache: new InMemoryCache()
})

export default client;