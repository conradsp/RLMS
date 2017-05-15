/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/contents              ->  index
 * POST    /api/contents              ->  create
 * GET     /api/contents/:id          ->  show
 * PUT     /api/contents/:id          ->  update
 * DELETE  /api/contents/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Content from './content.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Contents
export function index(req, res) {
  return Content.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Active Contents
export function getActive(req, res) {
  return Content.find({'active':'true'}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Content from the DB
export function show(req, res) {
  return Content.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Content in the DB
export function create(req, res) {
  return Content.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Content in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Content.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Content from the DB
export function destroy(req, res) {
  return Content.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
