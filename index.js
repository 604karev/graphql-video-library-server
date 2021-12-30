const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const conrs = require('cors');

const index = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://test_user:test123@graphql.70erq.mongodb.net/GraphQL?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));
index.use(conrs());
index.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));



index.listen(PORT, err => {
        err ? console.log(err) : console.log('Server started')
    }
);