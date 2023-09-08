/* eslint-disable jest/valid-expect */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const express = require('express');
const reviewsRouter = require('./controllers');

describe('GET /reviews/', () => {
  let server;
  const port = 3002;
  const app = express();

  before((done) => {
    app.use(reviewsRouter);
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

    request(app).get(`/`).expect(200).expect('Content-Type', /json/).end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should include review_id and photos property', (done) => {

    request(app).get(`/`).expect(200).end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('page').to.be.a('number');
        expect(res.body).to.have.property('count').to.be.a('number');
        expect(res.body).to.have.property('results').to.be.a('array');
        expect(res.body.results[0]).to.have.property('review_id').to.be.a('number');
        expect(res.body.results[0]).to.have.property('review_id').to.be.a('number');
        expect(res.body.results[0]).to.have.property('product_id').to.be.a('number');
        expect(res.body.results[0]).to.have.property('rating').to.be.a('number');
        expect(res.body.results[0]).to.have.property('date').to.equal('2020-07-30T03:41:21');
        expect(res.body.results[0]).to.have.property('summary').to.be.a('string');
        expect(res.body.results[0]).to.have.property('body').to.be.a('string');
        expect(res.body.results[0]).to.have.property('recommend').to.be.a('boolean');
        expect(res.body.results[0]).to.have.property('reviewer_name').to.be.a('string');
        expect(res.body.results[0]).to.have.property('response').to.be.a('null');
        expect(res.body.results[0]).to.have.property('helpfulness').to.be.a('number');
        expect(res.body.results[0]).to.have.property('photos').to.be.a('array');
        done();
      });
  });

  it('should return a 200 status code and valid JSON response for reviews meta data', (done) => {

    request(server).get(`/meta/?product_id=1`).expect(200).expect('Content-Type', /json/).end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('product_id').to.be.a(`number`);
        expect(res.body).to.have.property('ratings').to.have.property("1").to.be.a('number');
        expect(res.body).to.have.property('ratings').to.have.property("2").to.be.a('number');
        expect(res.body).to.have.property('ratings').to.have.property("3").to.be.a('number');
        expect(res.body).to.have.property('ratings').to.have.property("4").to.be.a('number');
        expect(res.body).to.have.property('ratings').to.have.property("5").to.be.a('number');
        expect(res.body).to.have.property('recommended').to.have.property('true').to.be.a('number');
        expect(res.body).to.have.property('recommended').to.have.property('false').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Fit').to.have.property('id').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Fit').to.have.property('value').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Length').to.have.property('id').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Length').to.have.property('value').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Comfort').to.have.property('id').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Comfort').to.have.property('value').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Quality').to.have.property('id').to.be.a('number');
        expect(res.body).to.have.property('characteristics').to.have.property('Quality').to.have.property('value').to.be.a('number');
        done();
      });
  });
});
config:
  # This is a test server run by team Artillery
  # It's designed to be highly scalable
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 1
      rampTo: 5
      name: Warm up phase
    - duration: 60
      arrivalRate: 5
      rampTo: 10
      name: Ramp up load
    - duration: 30
      arrivalRate: 10
      rampTo: 30
      name: Spike phase
  # Load & configure a couple of useful plugins
  # https://docs.art/reference/extensions
  plugins:
    ensure: {}
    apdex: {}
    metrics-by-endpoint: {}
  apdex:
    threshold: 100
  ensure:
      thresholds:
        - http.response_time.p99: 100
        - http.response_time.p95: 75
scenarios:
  - flow:
      - loop:
        - get:
            url: "/reviews/"
        count: 100



