/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/lots              ->  index
 * POST    /api/lots              ->  create
 * GET     /api/lots/:id          ->  show
 * PUT     /api/lots/:id          ->  update
 * DELETE  /api/lots/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Lot from './lot.model';

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
    // Having trouble with merging the nested animal objects.  They all live in the updates entity, so I
    // am going to remove them from the entity first before doing our merge.
    delete entity._doc.animals;
    delete entity._doc.photos;
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
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

export function getBids(req, res, next) {
  return User.findById(req.params.id).select('bids').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
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

// Gets a list of Lots
export function index(req, res) {
  var query = {};
  console.log(req.query);
  if (req.query.onlyOpen != null) {
    var criteria = "status";
    query[criteria] = "Open";
  }
  if (req.query.livestockType != null) {
    var livestock = "livestock_type";
    query[livestock] = req.query.livestockType;
  }

  if (req.query.status != null) {
    var selectStatus = "status";
    query[selectStatus] = req.query.status;
  }

  if (req.query.search != null) {
    var searchString = req.query.search;
    return Lot.find(query).find({'$or':[
      {'lot_name':{'$regex':searchString, '$options':'i'}},
      {'desc':{'$regex':searchString, '$options':'i'}},
      {'seller':{'$regex':searchString, '$options':'i'}},
      {'category':{'$regex':searchString, '$options':'i'}},
      {'livestock_type':{'$regex':searchString, '$options':'i'}}]})
      .select('lot_name seller desc quantity close_date category livestock_type photos current_bid status').sort('-close_date').exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  } else {

    return Lot.find(query).select('lot_name seller desc quantity close_date category livestock_type photos current_bid status district avg_weight top_weight bottom_weight').sort('-close_date').exec()
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
}

// Gets a list of Lots needing approval
export function lotsApproval(req, res) {
  return Lot.find({'status': 'Waiting'}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Lots needing approval
export function lotsClosing(req, res) {
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 3);
  return Lot.find({'status': 'Open', 'close_date': {
    $gte: today,
    $lt: tomorrow
  }}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Lots needing approval
export function lotsClosed(req, res) {
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 3);
  return Lot.find({'status': 'Closed', 'close_date': {
    $gte: yesterday,
    $lt: today
  }}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Lot from the DB
export function show(req, res) {
  return Lot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Lot in the DB
export function create(req, res) {
  return Lot.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function addBid(req, res) {
  return Lot.update({"_id":req.params.id, "current_bid":{ $lt: req.body.bid_amount}},{$addToSet: { "bids": req.body}, $set: {"current_bid": req.body.bid_amount}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteBid(req, res) {
  return Lot.update({"_id":req.params.id},{$pull: { "bids": { "user_id":req.params.userid}}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getWatches(req, res, next) {
  return Lot.findById(req.params.id).select('watching').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function addWatch(req, res) {
  return Lot.update({"_id":req.params.id},{$addToSet: { "watching": req.body}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function deleteWatch(req, res) {
  return Lot.update({"_id":req.params.id},{$pull: { "watching": { "user_id":req.params.userid}}}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Updates an existing Lot in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Lot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Change a lot status
export function changestatus(req, res) {
  return Lot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(doStatusChange(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Lot from the DB
export function destroy(req, res) {
  return Lot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
