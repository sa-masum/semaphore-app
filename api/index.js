const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://masum:semaphoreapp@cluster0.vozty.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB.")
}).catch((error) => {
    console.log("Error connecting to MongoDB-", error)
})

app.listen(port, () => {
    console.log("Server is running on port 8000...");
})