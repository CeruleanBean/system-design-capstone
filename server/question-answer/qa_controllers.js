const express = require('express');
const db = require('../db');


const qaRouter = express.Router();

qaRouter.get('/questions/', async (req, res) => {
  console.log('inside get query');
  // Add functionality to account for headers on count and page
  const count = req.query.count || 5;
  const page = req.query.page || 1;
  const offset = (page - 1) * count;

  // Define the SQL query as a prepared statement with placeholders
  const queryText = `
    SELECT
    JSON_BUILD_OBJECT(
      'question_id', question.id,
      'question_body', question.body,
      'asker_name', question.asker_name,
      'question_helpfulness', question.helpful,
      'question_date', question.date_written,
      'reported', question.reported,
      'answers',
      JSON_OBJECT_AGG(
        answer.id,
        JSON_BUILD_OBJECT(
          'id', answer.id,
          'body', answer.body,
          'date', answer.date_written,
          'answerer_name', answer.answerer_name,
          'helpfulness', answer.helpful,
          'reported', answer.reported,
          'photos', COALESCE(answer_photos, '[]'::json)
        )
      )
    ) AS question_and_answers
    FROM question
    JOIN answer ON answer.id_question = question.id
    LEFT JOIN (
      SELECT
        id_answer,
        COALESCE(json_agg(url), '[]'::json) AS answer_photos
      FROM answer_photos
      GROUP BY id_answer
    ) AS subquery ON subquery.id_answer = answer.id
    WHERE question.product_id = $1 AND question.reported = 'false' AND answer.reported = 'false'
    GROUP BY question.id
    ORDER BY question.id
    LIMIT $2 OFFSET $3`;

  const queryValues = [req.query.product_id, count, offset];

  try {
    const queryResult = await db.query(queryText, queryValues);

    const result = {
      product_id: `${req.query.product_id}`,
      results: queryResult.rows.map((question) => question.question_and_answers),
    };

    res.send(result);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).send('Internal Server Error');
  }
});



qaRouter.get('/questions/:question_id/answers', async (req, res) => {
  const count = req.query.count || 5;
  const page = req.query.page || 1;
  const offset = (page - 1) * count;
  const query = await db.query(`
  SELECT
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', answer.id,
      'body', answer.body,
      'date', answer.date_written,
      'answerer_name', answer.answerer_name,
      'helpfulness', answer.helpful,
      'reported', answer.reported,
      'photos', subquery.answer_photos
    )
  ) AS answers_with_photos
  FROM answer
  LEFT JOIN (
    SELECT
      id_answer,
      JSON_AGG(JSON_BUILD_OBJECT('url', url)) AS answer_photos
    FROM answer_photos
    GROUP BY id_answer
  ) AS subquery ON subquery.id_answer = answer.id
  WHERE answer.id_question = ${req.params.question_id} AND answer.reported = 'false'
  LIMIT ${count} OFFSET ${offset}`);

  const result = {
    question: `${req.params.question_id}`,
    page: `${req.params.page}`,
    count: `${req.params.count}`,
    results: []
  }
  query.rows[0].answers_with_photos.forEach((answer) => {
    result.results.push(answer);
  });

  res.send(result);
});

qaRouter.post('/questions', async (req, res) => {
  // add functionality to account for headers on count and page
  const { product_id, body, name, email } = req.query;

  const query = `
  INSERT INTO question (
    product_id, body, date_written, asker_name, asker_email, reported, helpful
  ) VALUES ($1, $2, NOW()::timestamp(0), $3, $4, $5, $6)`;

  const values = [product_id, body, name, email, false, 0]

  const result = await db.query(query, values);

  res.status(201).json({ message: 'Question inserted successfully'});
});

qaRouter.post('/questions/:question_id/answers', async (req, res) => {
  // add functionality to account for headers on count and page
  const { question_id, body, name, email } = req.query;

  const query = `
  INSERT INTO answer (
    id_question, body, date_written, answerer_name, answerer_email, reported, helpful
  ) VALUES ($1, $2, NOW()::timestamp(0), $3, $4, $5, $6)`;

  const values = [question_id, body, name, email, false, 0]

  const result = await db.query(query, values);

  res.status(201).json({ message: 'Answer inserted successfully'});
});

qaRouter.put('/questions/:question_id/helpful', async (req, res) => {
  // add functionality to account for headers on count and page
  const { question_id } = req.params;

  const query = `
  UPDATE question
  SET helpful = helpful + 1
  WHERE question.id = $1;
  `;

  const values = [question_id]

  const result = await db.query(query, values);

  res.status(204).send();
});

qaRouter.put('/questions/:question_id/report', async (req, res) => {
  // add functionality to account for headers on count and page
  const { question_id } = req.params;

  const query = `
  UPDATE question
  SET reported = true
  WHERE question.id = $1;
  `;

  const values = [question_id]

  const result = await db.query(query, values);

  res.status(204).send();
});

qaRouter.put('/answers/:answer_id/helpful', async (req, res) => {
  // add functionality to account for headers on count and page
  const { answer_id } = req.params;

  const query = `
  UPDATE answer
  SET helpful = helpful + 1
  WHERE answer.id = $1;
  `;

  const values = [answer_id]

  const result = await db.query(query, values);

  res.status(204).send();
});

qaRouter.put('/answers/:answer_id/report', async (req, res) => {
  // add functionality to account for headers on count and page
  const { answer_id } = req.params;

  const query = `
  UPDATE answer
  SET reported = true
  WHERE answer.id = $1;
  `;

  const values = [answer_id]

  const result = await db.query(query, values);

  res.status(204).send();
});

module.exports = qaRouter;