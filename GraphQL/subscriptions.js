import gql from 'graphql-tag';

export const repairCreatedSubscription = {
    query: gql`
        subscription {
            repairCreated {
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
}

export const repairUpdatedSubscription = {
    query: gql`
        subscription {
            repairUpdated {
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
}

export const repairRemovedSubscription = {
    query: gql`
        subscription {
            repairRemoved
        }
    `
}

export const carCreatedSubscription = {
    query: gql`
        subscription {
            carCreated {
                _id
                make
                model
                year
            }
        }
    `
}

export const carUpdatedSubscription = {
    query: gql`
        subscription {
            carUpdated {
                _id
                make
                model
                year
            }
        }
    `
}

export const carRemovedSubscription = {
    query: gql`
        subscription {
            carRemoved
        }
    `
}