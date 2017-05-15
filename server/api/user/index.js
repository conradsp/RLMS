'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.put('/', auth.isAuthenticated(), controller.sortedIndex);
router.get('/admin', auth.isAuthenticated(), controller.getAdmin);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/approval', auth.hasRole('admin'), controller.usersApproval);
router.put('/status/:id', auth.hasRole('admin'), controller.changestatus);
router.put('/:id', auth.isAuthenticated(), controller.updateUser);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);


router.get('/:id/bid', controller.getBids);
router.post('/:id/bid', controller.addBid);
router.delete('/:id/bid/:lotid', controller.deleteBid);
router.get('/:id/watch', controller.getWatches);
router.post('/:id/watch', controller.addWatch);
router.delete('/:id/watch/:lotid', controller.deleteWatch);

router.get('/:id/message', controller.getMessages);
router.post('/:id/message', controller.addMessage);
router.put('/:id/message', controller.updateMessage);
router.delete('/:id/message/:msgid', controller.deleteMessage);


module.exports = router;
