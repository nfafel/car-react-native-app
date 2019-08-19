import {ApolloClient} from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import AsyncStorage from '@react-native-community/async-storage'
   
httpLink = createHttpLink({
    uri: 'https://tranquil-caverns-41069.herokuapp.com/graphql',
});
    
wsLink = new WebSocketLink({
    uri: 'wss://tranquil-caverns-41069.herokuapp.com/graphql',
    options: {
        reconnect: true
    }
})

authLink = setContext(async(_, { headers }) => {
    // get the authentication token from local storage if it exists
    const result = await AsyncStorage.getItem('persist:root');
    const body = JSON.parse(result);
    const token = body.token.replace(/"/g, "");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
    
link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
)

client = new ApolloClient({ 
    link: authLink.concat(link),
    cache: new InMemoryCache()
})

export default client;