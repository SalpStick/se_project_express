const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "6699540bd7fe997347a9a6e6",
  };
  next();
});

app.use(express.json());
app.use(cors());

app.use("/", indexRouter);


app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});
