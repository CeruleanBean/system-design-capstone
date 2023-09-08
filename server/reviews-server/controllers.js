const express = require('express');
const db = require('../db');

const reviewsRouter = express.Router();

reviewsRouter.get('/', (req, res) => {
  const count = req.query.count || 5;
  const page = req.query.page || 1;

  const queryString = `SELECT
  reviews.review_id,
  reviews.product_id,
  reviews.rating,
  TO_JSON(reviews.date) AS date,
  reviews.summary,
  reviews.body,
  reviews.recommend,
  reviews.reviewer_name,
  CASE
    WHEN reviews.response = 'null' THEN NULL -- Convert 'null' to null
    ELSE reviews.response
  END AS response,
  reviews.helpfulness,
  CASE
    WHEN COUNT(review_photos.id) = 0 THEN '[]'::jsonb
    ELSE jsonb_agg(
      JSON_BUILD_OBJECT(
        'id', review_photos.id,
        'url', review_photos.url
      ) ORDER BY review_photos.id
    )
  END AS photos
  FROM reviews
  LEFT JOIN review_photos on reviews.review_id = review_photos.id_reviews
  WHERE reviews.review_id >= ${(count * page) - count + 1} AND reviews.review_id <= ${page * count} AND reviews.reported=false
  GROUP BY reviews.review_id`

  var query = db.query(queryString).then((result) => {
    const final = {
      "product" : req.query.product_id,
      "page": page,
      "count": count,
      "results": result.rows
  }
    res.send(final);
  })

  // respond w data - transformed to how front end needs it
});

reviewsRouter.get('/meta', (req, res) => {

  const queryString = `SELECT reviews.product_id,
   JSON_BUILD_OBJECT(
  '1' , count(reviews.rating) FILTER (where reviews.rating = 1),
  '2' , count(reviews.rating) FILTER (where reviews.rating = 2),
  '3' , count(reviews.rating) FILTER (where reviews.rating = 3),
  '4' , count(reviews.rating) FILTER (where reviews.rating = 4),
  '5' , count(reviews.rating) FILTER (where reviews.rating = 5)
) AS ratings,
  json_build_object(
  'true' , count(reviews.recommend) FILTER (where reviews.recommend = TRUE),
  'false' , count(reviews.recommend) FILTER (where reviews.recommend = FALSE)
) AS recommended,
  jsonb_object_agg(
  characteristics.name, jsonb_build_object(
  'id' , characteristic_rating.id_characteristics,
  'value' , characteristic_rating.value
  )
) AS Characteristics
from reviews
INNER JOIN characteristics on characteristics.product_id = reviews.product_id
INNER JOIN  characteristic_rating ON characteristic_rating.id_characteristics = characteristics.id
where reviews.product_id = ${req.query.product_id}
GROUP BY reviews.product_id`
var query = db.query(queryString).then((result) => {
  res.send(result.rows[0]);
})
});

reviewsRouter.put('/:review_id/helpfulness', (req, res) => {
  const queryString = `UPDATE reviews SET helpfulness=helpfulness + 1 WHERE "review_id"=${req.params.review_id}`
  var query = db.query(queryString).then((result) => {
    res.status(204);
    res.send();
  })

});

reviewsRouter.put('/:review_id/report', (req, res) => {
  const queryString =` UPDATE reviews SET reported=true WHERE "review_id"=${req.params.review_id}`
  var query = db.query(queryString).then((result) => {
    res.status(204);
    res.send();
  })
});

reviewsRouter.post('/', (req, res) => {
  req.body.characteristics =  { "1": 5, "2": 5, "3" : 5, "4": 5 }
  const queryReviewString = `insert into
  reviews (
    product_id,
    rating,
    "date",
    summary,
    body,
    recommend,
    reported,
    reviewer_name,
    reviewer_email,
    response,
    helpfulness
  )
values
  (
    ${req.body.product_id},
    ${req.body.rating},
    NOW()::timestamp(0),
    '${req.body.summary}',
    '${req.body.body}',
    ${req.body.recommend},
    false,
    '${req.body.name}',
    '${req.body.email}',
    'null',
    0
  )
  RETURNING review_id`
  var query = db.query(queryReviewString).then((result) => {
    console.log(result.rows[0].review_id)
    const reviewId = result.rows[0].review_id;
    const photoQuery = `insert into
    review_photos (
      id_reviews,
      url
    )
  values
    (
      '${reviewId}',
      '${req.body.photos[i]}'
    )`
    for ( var key in req.body.characteristics) {
      const characteristicsQuery = `insert into
      characteristic_rating (
        id_characteristics,
        id_reviews,
        "value"
      )
    values
      (
        '${key}',
        '${reviewId}',
        '${req.body.characteristics[key]}'
      );`
      db.query(characteristicsQuery).then((result) => {
      })

    }
    for ( var i = 0; i < req.body.photos.length; i++) {
      db.query(photoQuery).then((result) => {
      })
    }
  })
  res.status(204)
  res.send()
});

module.exports = reviewsRouter;


