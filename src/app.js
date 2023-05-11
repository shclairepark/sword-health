const express = require("express");
const bodyParser = require("body-parser");

// Create express app snd setup port
const app = express();
const port = process.env.APP_PORT || 3000;

// Parse requests with content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse requests with content-type - application/json
app.use(bodyParser.json());

const tasks = require("./routes/tasks");

app.use("/api/tasks", tasks);

// Start the server
var server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = server;
