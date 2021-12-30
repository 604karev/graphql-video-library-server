const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLBoolean} = graphql;
const Movies = require('../models/movie');
const Directors = require('../models/director');


const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        directorId: {type: GraphQLString},
        rate: {type: GraphQLInt},
        watched: {type: GraphQLBoolean},
        director: {
            type: DirectorType,
            resolve({directorId}, args) {
                return Directors.findById(directorId)
            }
        }
    })
});
const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        movies: {
            type: GraphQLList(MovieType),
            resolve({id}, args) {
                return Movies.find({directorId: id})
            }
        }
    })
});
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
            },
            resolve(parent, {name, age}) {
                const director = new Directors({name, age});
                return director.save();
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                directorId: {type: GraphQLID},
                rate: {type: GraphQLInt},
                watched: {type: GraphQLBoolean}
            },
            resolve(parent, {...args}) {
                const movie = new Movies({
                    ...args
                });
                return movie.save();
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}) {
                return Directors.findOneAndDelete({_id: id})
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}) {
                return Movies.findOneAndDelete({_id: id})
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
            },
            resolve(parent, {id, name, age}) {
                return Directors.findOneAndUpdate(
                    {_id: id},
                    {$set: {name, age}},
                    {new: true, useFindAndModify: false}
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                directorId: {type: GraphQLID},
                rate: {type: GraphQLInt},
                watched: {type: GraphQLBoolean}
            },
            resolve(parent, {id, ...movieProps}) {
                return Movies.findOneAndUpdate(
                    {_id: id},
                    {$set: {...movieProps}},
                    {new: true, useFindAndModify: false}
                )
            }
        },
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}) {
                return Movies.findById(id)

            }
        },
        director: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}) {
                return Directors.findById(id)

            }
        },
        movies: {
            type: GraphQLList(MovieType),
            args: {name: {type: GraphQLString}},
            resolve(parent, {name}) {
                return Movies.find({name: {$regex: name, $options: "i"}})
            }
        },
        directors: {
            type: GraphQLList(DirectorType),
            args: {name: {type: GraphQLString}},
            resolve(parent, {name}) {
                return Directors.find({name: {$regex: name, $options: "i"}})
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});