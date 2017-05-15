'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(handleError(res));
}

export function sortedIndex(req, res) {
  if (req.body.search != null){
    var searchString = req.body.search;
    return User.find({'$or':[
      {'username':{'$regex':searchString, '$options':'i'}},
      {'fullname':{'$regex':searchString, '$options':'i'}},
      {'status':{'$regex':searchString, '$options':'i'}},
      {'province':{'$regex':searchString, '$options':'i'}},
      {'farmname':{'$regex':searchString, '$options':'i'}}]}).select('username fullname status province district farmname').exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
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

// Updates an existing User in the DB
export function updateUser(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return User.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Users needing approval
export function usersApproval(req, res) {
  return User.find({'status': 'New'}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function doStatusChange(updates) {
  return function(entity) {
    entity.status = updates.status;
    return entity.save()
      .then(entity => {
        return entity;
      });
  };
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getAdmin(req, res) {

  return User.find({'role':'admin'}, '-salt -password').exec()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      return res.status(200).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
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

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
  };
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      return res.json(user);
    })
    .catch(err => next(err));
}

export function addBid(req, res) {
  return User.update({"_id":req.params.id},{$addToSet: { "bids": req.body}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteBid(req, res) {
  // Pulls all bids for a particular lot
  return User.update({"_id":req.params.id},{$pull: { "bids": { "lot_id":req.params.lotid}}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function addWatch(req, res) {
  return User.update({"_id":req.params.id},{$addToSet: { "watching": req.body}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteWatch(req, res) {
  return User.update({"_id":req.params.id},{$pull: { "watching": { "lot_id":req.params.lotid}}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getBids(req, res, next) {
  return User.findById(req.params.id).select('bids').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getWatches(req, res, next) {
  return User.findById(req.params.id).select('watching').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getMessages(req, res, next) {
  var userId = req.params.id;

  return User.findById(req.params.id).select('messages').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function addMessage(req, res) {
  return User.update({"_id":req.params.id},{$push: { "messages": req.body}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function updateMessage(req, res) {
  return User.update({"_id":req.params.id, 'messages': { $elemMatch: {"_id":req.body._id}}},
    {$set: {'messages.$.status': req.body.status}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteMessage(req, res) {
  return User.update({"_id":req.params.id},{$pull: { "messages": { "_id":req.params.msgid}}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Change a lot status
export function changestatus(req, res) {
  return User.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(doStatusChange(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}
