const express = require('express');
const db = require('../db');

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const count = req.query.count || 5;
  const page = req.query.page || 1;
  const query = await db.query(`
    SELECT
      *
    FROM
      product
    WHERE
      product.id >= ${(count * page) - count + 1} AND product.id <= ${page * count}
  `);
  res.send(query.rows);
});

productRouter.get('/:product_id', async (req, res) => {
  const query = await db.query(`
  SELECT
    product.id, product.name, product.slogan, product.description, product.category, product.default_price,
    ARRAY_AGG(JSON_BUILD_OBJECT('Feature', features.feature, 'Value', features.value)) AS features
  FROM
    product
  INNER JOIN
    features ON features.product_id = product.id
  WHERE
    product.id = ${req.params.product_id}
  GROUP BY
    product.id
  `);
  res.send(query.rows[0]);
});

productRouter.get('/:product_id/styles', async (req, res) => {
  const query = await db.query(`
  SELECT
    styles.id AS style_id,
    styles.name AS name,
    styles.original_price AS original_price,
    styles.sale_price AS sale_price,
    styles.default_style AS "default?",
    JSON_AGG(DISTINCT
      JSONB_BUILD_OBJECT(
        'thumbnail_url', photos.thumbnail_url,
        'url', photos.url
      )
    ) AS photos,
    JSON_OBJECT_AGG(
      skus.id, JSON_BUILD_OBJECT(
        'quantity', skus.quantity,
        'size', skus.size
      )
    ) AS skus
  FROM
    styles
  INNER JOIN
    photos ON photos.style_id = styles.id
  INNER JOIN
    skus ON skus.style_id = styles.id
  WHERE
    styles.product_id = ${req.params.product_id}
  GROUP BY
    styles.id
  `);
  let response = {
    product_id: `${req.params.product_id}`,
    results: query.rows
  }
  response.results.forEach(style => {
    style['default?'] = (style['default?'] === '1' ? true : false);
    style['sale_price'] = (style['sale_price'] === 'null' ? null : Number(style['sale_price']));
  })
  res.send(response);
});

module.exports = productRouter;
