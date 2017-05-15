'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newContent;

describe('Content API:', function() {
  describe('GET /api/contents', function() {
    var contents;

    beforeEach(function(done) {
      request(app)
        .get('/api/contents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          contents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(contents).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/contents', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/contents')
        .send({
          name: 'New Content',
          info: 'This is the brand new content!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newContent = res.body;
          done();
        });
    });

    it('should respond with the newly created content', function() {
      expect(newContent.name).to.equal('New Content');
      expect(newContent.info).to.equal('This is the brand new content!!!');
    });
  });

  describe('GET /api/contents/:id', function() {
    var content;

    beforeEach(function(done) {
      request(app)
        .get(`/api/contents/${newContent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          content = res.body;
          done();
        });
    });

    afterEach(function() {
      content = {};
    });

    it('should respond with the requested content', function() {
      expect(content.name).to.equal('New Content');
      expect(content.info).to.equal('This is the brand new content!!!');
    });
  });

  describe('PUT /api/contents/:id', function() {
    var updatedContent;

    beforeEach(function(done) {
      request(app)
        .put(`/api/contents/${newContent._id}`)
        .send({
          name: 'Updated Content',
          info: 'This is the updated content!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedContent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedContent = {};
    });

    it('should respond with the updated content', function() {
      expect(updatedContent.name).to.equal('Updated Content');
      expect(updatedContent.info).to.equal('This is the updated content!!!');
    });

    it('should respond with the updated content on a subsequent GET', function(done) {
      request(app)
        .get(`/api/contents/${newContent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let content = res.body;

          expect(content.name).to.equal('Updated Content');
          expect(content.info).to.equal('This is the updated content!!!');

          done();
        });
    });
  });

  describe('PATCH /api/contents/:id', function() {
    var patchedContent;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/contents/${newContent._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Content' },
          { op: 'replace', path: '/info', value: 'This is the patched content!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedContent = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedContent = {};
    });

    it('should respond with the patched content', function() {
      expect(patchedContent.name).to.equal('Patched Content');
      expect(patchedContent.info).to.equal('This is the patched content!!!');
    });
  });

  describe('DELETE /api/contents/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/contents/${newContent._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when content does not exist', function(done) {
      request(app)
        .delete(`/api/contents/${newContent._id}`)
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
