'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newLot;

describe('Lot API:', function() {
  describe('GET /api/lots', function() {
    var lots;

    beforeEach(function(done) {
      request(app)
        .get('/api/lots')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          lots = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(lots).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/lots', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/lots')
        .send({
          lot_name: 'New Lot',
          desc: 'This is the brand new lot!!!',
          status: 'Waiting'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newLot = res.body;
          done();
        });
    });

    it('should respond with the newly created lot', function() {
      expect(newLot.lot_name).to.equal('New Lot');
      expect(newLot.desc).to.equal('This is the brand new lot!!!');
      expect(newLot.status).to.equal('Waiting');
    });
  });

  describe('GET /api/lots/id/:id', function() {
    var lot;

    beforeEach(function(done) {
      request(app)
        .get(`/api/lots/id/${newLot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          lot = res.body;
          done();
        });
    });

    afterEach(function() {
      lot = {};
    });

    it('should respond with the requested lot', function() {
      expect(lot.lot_name).to.equal('New Lot');
      expect(lot.desc).to.equal('This is the brand new lot!!!');
    });
  });

  describe('PUT /api/lots/:id', function() {
    var updatedLot;

    beforeEach(function(done) {
      request(app)
        .put(`/api/lots/${newLot._id}`)
        .send({
          lot_name: 'Updated Lot',
          desc: 'This is the updated lot!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedLot = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLot = {};
    });

    it('should respond with the updated lot', function() {
      expect(updatedLot.lot_name).to.equal('Updated Lot');
      expect(updatedLot.desc).to.equal('This is the updated lot!!!');
    });

    it('should respond with the updated lot on a subsequent GET', function(done) {
      request(app)
        .get(`/api/lots/id/${newLot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let lot = res.body;

          expect(lot.lot_name).to.equal('Updated Lot');
          expect(lot.desc).to.equal('This is the updated lot!!!');

          done();
        });
    });
  });

  describe('POST /api/lots/status/:id', function() {
    var patchedLot;

    beforeEach(function(done) {
      request(app)
        .post(`/api/lots/status/${newLot._id}`)
        .send({
          status: 'Open'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedLot = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedLot = {};
    });

    it('should respond with the patched lot', function() {
      expect(patchedLot.status).to.equal('Open');
    });
  });

  describe('DELETE /api/lots/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/lots/id/${newLot._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when lot does not exist', function(done) {
      request(app)
        .delete(`/api/lots/id/${newLot._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
