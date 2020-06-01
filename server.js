const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
const app = express();
const usersRouter = require("./routes/usersRouter");

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

require("./passport")(passport);

app.use("/users", usersRouter);

PORT = process.env.PORT;
URI = process.env.URI;

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Database Connected!"))
  .catch((err) => console.error(err));

app.listen(PORT || 5000, console.log("Up and Running at port " + PORT));
