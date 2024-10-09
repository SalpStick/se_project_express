const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/ErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use("/", indexRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);


app.listen(PORT, () => {});
