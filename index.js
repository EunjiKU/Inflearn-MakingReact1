const express = require('express')
const app = express()
const port = 5000

const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://yoo128:1234@cluster0.yj7sq9q.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello Worldss!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})