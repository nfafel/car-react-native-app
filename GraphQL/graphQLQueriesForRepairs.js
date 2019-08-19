import {gql} from 'apollo-boost';
import client from './apolloClient';

export const getRepairsData = async(token) => {
    const result = await client.query({
        variables:{
            authorization: `Bearer ${token}`
        },
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

export const deleteData = async(repairId, token) => {
    const result = await client.mutate({
        variables:{
            authorization: `Bearer ${token}`
        },
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

export const putData = async(repairId, values, token) => {
    const result = await client.mutate({
        variables: {
            authorization: `Bearer ${token}`, 
            input: {
                car_id: values.car_id,
                description: values.description,
                date: values.date,
                cost: values.cost,
                progress: values.progress,
                technician: values.technician
            }
        },
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

export const postData = async(values, token) => {
    const result = await client.mutate({
        variables: { 
            authorization: `Bearer ${token}`, 
            input: {
                car_id: values.car_id,
                description: values.description,
                date: values.date,
                cost: parseInt(values.cost),
                progress: values.progress,
                technician: values.technician
            }
        },
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

export const subscribeToRepairsData = async (context, token) => {
    client.subscribe({
        authorization: {
            authorization: `Bearer ${token}`
        },
        query: gql`
            subscription {
                repairChanged {
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
    }).subscribe({
        next(res) {
            context.setState({repairs: res.data.repairChanged})
        },
        error(err) {console.log(err)}
    });
}