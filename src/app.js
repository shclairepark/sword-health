const express = require("express");
const bodyParser = require("body-parser");

// create express app snd setup port
const app = express();
const port = process.env.PORT || 3000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// Root route
app.get("/", (_, res) => {
  res.send("Hello World");
});

const tasks = require("./routes/tasks");

app.use("/api/tasks", tasks);

// Start the server
var server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = server;
