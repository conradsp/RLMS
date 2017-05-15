'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPhoto;

describe('Photo API:', function() {
  describe('GET /api/photos', function() {
    var photos;

    beforeEach(function(done) {
      request(app)
        .get('/api/photos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          photos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(photos).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/photos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/photos')
        .send({
          name: 'New Photo',
          info: 'This is the brand new photo!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPhoto = res.body;
          done();
        });
    });

    it('should respond with the newly created photo', function() {
      expect(newPhoto.name).to.equal('New Photo');
      expect(newPhoto.info).to.equal('This is the brand new photo!!!');
    });
  });

  describe('GET /api/photos/:id', function() {
    var photo;

    beforeEach(function(done) {
      request(app)
        .get(`/api/photos/${newPhoto._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          photo = res.body;
          done();
        });
    });

    afterEach(function() {
      photo = {};
    });

    it('should respond with the requested photo', function() {
      expect(photo.name).to.equal('New Photo');
      expect(photo.info).to.equal('This is the brand new photo!!!');
    });
  });

  describe('PUT /api/photos/:id', function() {
    var updatedPhoto;

    beforeEach(function(done) {
      request(app)
        .put(`/api/photos/${newPhoto._id}`)
        .send({
          name: 'Updated Photo',
          info: 'This is the updated photo!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPhoto = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPhoto = {};
    });

    it('should respond with the updated photo', function() {
      expect(updatedPhoto.name).to.equal('Updated Photo');
      expect(updatedPhoto.info).to.equal('This is the updated photo!!!');
    });

    it('should respond with the updated photo on a subsequent GET', function(done) {
      request(app)
        .get(`/api/photos/${newPhoto._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let photo = res.body;

          expect(photo.name).to.equal('Updated Photo');
          expect(photo.info).to.equal('This is the updated photo!!!');

          done();
        });
    });
  });

  describe('PATCH /api/photos/:id', function() {
    var patchedPhoto;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/photos/${newPhoto._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Photo' },
          { op: 'replace', path: '/info', value: 'This is the patched photo!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPhoto = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPhoto = {};
    });

    it('should respond with the patched photo', function() {
      expect(patchedPhoto.name).to.equal('Patched Photo');
      expect(patchedPhoto.info).to.equal('This is the patched photo!!!');
    });
  });

  describe('DELETE /api/photos/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/photos/${newPhoto._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when photo does not exist', function(done) {
      request(app)
        .delete(`/api/photos/${newPhoto._id}`)
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
