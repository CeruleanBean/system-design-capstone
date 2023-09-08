require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const productRouter = require('./product-server/controllers');
const qaRouter = require('./question-answer/qa_controllers');
app.use(cors());
// const qaRouter = require('./qa-server/controllers');
const reviewsRouter = require('./reviews-server/controllers');

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/products', productRouter);
// app.use('/qa', qaRouter);
app.use('/reviews', reviewsRouter);

app.use('/qa', qaRouter);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
  }
});
