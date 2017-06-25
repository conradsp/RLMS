'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

var newContent;

describe('Content API:', function() {
  var user;
  var token;

  before(function() {
    return User.remove().then(function() {
      user = new User({
        username: 'test@example.com',
        email: 'test@example.com',
        fullname: 'Test User',
        password: 'password',
        role: 'admin'
      });

      return user.save();
    });
  });

  before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          username: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

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
          short_desc: 'This is the brand new content!!!'
        })
        .set('authorization', `Bearer ${token}`)
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
      expect(newContent.short_desc).to.equal('This is the brand new content!!!');
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
      expect(content.short_desc).to.equal('This is the brand new content!!!');
    });
  });

  describe('PUT /api/contents/:id', function() {
    var updatedContent;

    beforeEach(function(done) {
      request(app)
        .put(`/api/contents/${newContent._id}`)
        .send({
          name: 'Updated Content',
          short_desc: 'This is the updated content!!!'
        })
        .set('authorization', `Bearer ${token}`)
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
      expect(updatedContent.short_desc).to.equal('This is the updated content!!!');
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
          expect(content.short_desc).to.equal('This is the updated content!!!');

          done();
        });
    });
  });

  describe('DELETE /api/contents/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/contents/${newContent._id}`)
        .set('authorization', `Bearer ${token}`)
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
        .set('authorization', `Bearer ${token}`)
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
