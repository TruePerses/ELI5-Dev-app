const express = require("express");

// create instance of the express application
const app = express();

// import body-parser to parse json data
const bodyParser = require("body-parser");

//use body-parser to parse incoming json data
app.use(bodyParser.json());

// import the chatGPT endpoint module
const chatGPTRoutes = require("./routes/chatGPT.js");

// use chatGPT endpoint module to handle requests to "/api"
app.use("/api" , chatGPTRoutes);

// Handle any errors by sending a 500 internal server error status message
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
}); 

// start the server and listen to port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000");
});