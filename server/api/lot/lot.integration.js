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
          name: 'New Lot',
          info: 'This is the brand new lot!!!'
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
      expect(newLot.name).to.equal('New Lot');
      expect(newLot.info).to.equal('This is the brand new lot!!!');
    });
  });

  describe('GET /api/lots/:id', function() {
    var lot;

    beforeEach(function(done) {
      request(app)
        .get(`/api/lots/${newLot._id}`)
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
      expect(lot.name).to.equal('New Lot');
      expect(lot.info).to.equal('This is the brand new lot!!!');
    });
  });

  describe('PUT /api/lots/:id', function() {
    var updatedLot;

    beforeEach(function(done) {
      request(app)
        .put(`/api/lots/${newLot._id}`)
        .send({
          name: 'Updated Lot',
          info: 'This is the updated lot!!!'
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
      expect(updatedLot.name).to.equal('Updated Lot');
      expect(updatedLot.info).to.equal('This is the updated lot!!!');
    });

    it('should respond with the updated lot on a subsequent GET', function(done) {
      request(app)
        .get(`/api/lots/${newLot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let lot = res.body;

          expect(lot.name).to.equal('Updated Lot');
          expect(lot.info).to.equal('This is the updated lot!!!');

          done();
        });
    });
  });

  describe('PATCH /api/lots/:id', function() {
    var patchedLot;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/lots/${newLot._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Lot' },
          { op: 'replace', path: '/info', value: 'This is the patched lot!!!' }
        ])
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
      expect(patchedLot.name).to.equal('Patched Lot');
      expect(patchedLot.info).to.equal('This is the patched lot!!!');
    });
  });

  describe('DELETE /api/lots/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/lots/${newLot._id}`)
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
        .delete(`/api/lots/${newLot._id}`)
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
