import ApolloClient, {gql} from 'apollo-boost';

/*
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import ApolloClient, {createNetworkInterface, gql} from 'apollo-client';

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:3000' // Your GraphQL endpoint
});

const wsClient = new SubscriptionClient(`ws://localhost:5000/`, {
    reconnect: true,
    connectionParams: {
        // Pass any arguments you want for initialization
    }
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);

// Finally, create your ApolloClient instance with the modified network interface
const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
});
*/

const client = new ApolloClient({
  uri: "https://tranquil-caverns-41069.herokuapp.com/graphql"
});

client.defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only'
  },
  query: {
    fetchPolicy: 'network-only'
  }
}

export const getRepairsData = async() => {
    const result = await client.query({
        query:gql`
            query {
                repairs {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost
                    progress
                    technician
                }
            }
        `
    });
    return result.data.repairs;
};

export const deleteData = async(repairId) => {
    const result = await client.mutate({
        mutation:gql`
            mutation {
                removeRepair(id: "${repairId}") {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost 
                    progress
                    technician
                }
            }
        `
    });
    return result.data.removeRepair;
}

export const putData = async(repairId, values) => {
    const result = await client.mutate({
        variables: { input: {
            car_id: values.car_id,
            description: values.description,
            date: values.date,
            cost: values.cost,
            progress: values.progress,
            technician: values.technician
        }},
        mutation:gql`
            mutation UpdateRepairInput($input: RepairInput){
                updateRepair(id: "${repairId}", input: $input) {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost 
                    progress
                    technician
                }
            }
        `
    });
    return result.data.updateRepair;
}

export const postData = async(values) => {
    const result = await client.mutate({
        variables: { input: {
            car_id: values.car_id,
            description: values.description,
            date: values.date,
            cost: parseInt(values.cost),
            progress: values.progress,
            technician: values.technician
        }},
        mutation:gql`
            mutation NewRepairInput($input: RepairInput){
                createRepair(input: $input) {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost 
                    progress
                    technician
                }
            }
        `
    });
    return result.data.createRepair;
}