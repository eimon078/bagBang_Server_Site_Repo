const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000;

// middleware 
app.use(cors());
app.use(express.json());

// connect mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxj01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


app.get('/', (req, res) => {
    res.send("Doctors Portal Running");
})

app.listen(port, () => {
    console.log("Running Port", port);
})