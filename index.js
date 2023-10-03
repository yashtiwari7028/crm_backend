const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { DB_URL, DB_NAME } = require("./configs/db.config");
const { PORT } = require("./configs/service.config");
const app = express();
app.use(bodyParser.json());

mongoose
  .connect(`${DB_URL}/${DB_NAME}`)
  .then(() => console.log("Connected successfully"))
  .catch((ex) => console.log("Error connecting", ex));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);
app.listen(PORT);
