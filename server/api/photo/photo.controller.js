/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/photos              ->  index
 * POST    /api/photos              ->  create
 * GET     /api/photos/:id          ->  show
 * PUT     /api/photos/:id          ->  update
 * DELETE  /api/photos/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Photo from './photo.model';

var multipart=require('multiparty');
var uuid = require('uuid');
var fs = require('fs');

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

// Gets a list of Photos
export function index(req, res) {
  return Photo.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Photo from the DB
export function show(req, res) {
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Photo in the DB
export function create(req, res) {
  var fileName;

  var form = new multipart.Form({ autoFiles: true, uploadDir: './client/assets/images/uploads'});
  form.on('part', function(part){
    if(!part.filename) return;
    fileName = part.filename;
  });
  form.on('file', function(name,file){
    var contentType = file.headers['content-type'];
    var tmpPath = file.path;
    console.log(tmpPath);
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    // uuid is for generating unique filenames.
//    var fileName = uuid.v4() + extension;

    // __dirname will give the module path (<webapp path>/server/api/photo)
 //   var destPath = __dirname+"/../../../client/assets/images/uploads/" + fileName;
 //   var clientPath = "assets/images/uploads/" + fileName;

    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
      fs.unlink(tmpPath);
      return res.status(400).send('Unsupported file type.');
    }

    //console.log(destPath);
   // fs.rename(tmpPath, destPath, function(err) {
   //   if (err) {
   //     return res.status(400).send('Image is not saved:'+err);
   //   }
      tmpPath=tmpPath.replace("client/","");
      return res.json('/'+tmpPath);
   // });

  });
  form.parse(req);
}

// Updates an existing Photo in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Photo from the DB
export function destroy(req, res) {
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
