// rebased
/* eslint-disable jest/valid-expect */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const express = require('express');
const productRouter = require('./controllers');

describe('GET /products', () => {
  let server;
  const port = 3002;
  const app = express();

  before((done) => {
    app.use(productRouter);
    server = app.listen(port, () => {
      console.log(`Test server is running on http://localhost:${port}`);
      done();
    });
  });

  after((done) => {
    server.close(() => {
      console.log('Test server closed');
      done();
    });
  });

  it('should return a 200 status code and valid JSON response', (done) => {
    request(app)
      .get(`/`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should include correct properties in the JSON response', (done) => {
    const productId = 10000;

    request(app)
      .get(`/${productId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('slogan');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('category');
        expect(res.body).to.have.property('default_price');
        expect(res.body).to.have.property('features');
        done();
      });
  });

  it('should return a 200 status code and styles for a product', (done) => {
    const productId = 1;

    request(server)
      .get(`/${productId}/styles`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);


        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('product_id');
        expect(res.body).to.have.property('results');
        expect(res.body).to.have.property('results').to.be.an('array');


        const results = res.body.results;
        expect(results).to.have.lengthOf.at.least(1);
        expect(results[0]).to.have.property('style_id').to.be.a('number');
        expect(results[0]).to.have.property('name').to.be.a('string');
        expect(results[0]).to.have.property('default?').to.be.a('boolean');
        expect(results[0]).to.have.property('photos').to.be.an('array');
        expect(results[0]).to.have.property('skus');
        done();
      });
  });
});