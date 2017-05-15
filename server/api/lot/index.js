'use strict';

var express = require('express');
var controller = require('./lot.controller');

var router = express.Router();

router.get('/', controller.index);
router.put('/', controller.sortedIndex);
router.get('/id/:id', controller.show);
router.post('/', controller.create);
router.post('/status/:id', controller.changestatus);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/id/:id', controller.destroy);

router.get('/:id/bid', controller.getBids);
router.post('/:id/bid', controller.addBid);
router.delete('/:id/bid/:userid', controller.deleteBid);
router.get('/:id/watch', controller.getWatches);
router.post('/:id/watch', controller.addWatch);
router.delete('/:id/watch/:userid', controller.deleteWatch);

router.get('/approval', controller.lotsApproval);
router.get('/closing', controller.lotsClosing);
router.get('/closed', controller.lotsClosed);

module.exports = router;
